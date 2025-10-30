export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif';
export type ImageSource = File | Blob;

export interface ConvertOptions {
    format: ImageFormat;
    quality?: number;
};
export interface FlipOptions {
    horizontally: boolean;
    vertically: boolean;
}
export interface RotateOptions {
    angle: number;
}
export interface ResizeOptions {
    width: number;
    height: number;
}
export interface ImageOptions {
    format: ImageFormat;
    width: number;
    height: number;
    quality: number;
    flipHorizontally: boolean;
    flipVertically: boolean;
    rotateAngle: number;
}
export interface ManipulateOptions extends Partial<ImageOptions> { }

export async function convert(source: ImageSource, options: ConvertOptions): Promise<Blob> {
    return await manipulate(source, options);
}

export async function flip(source: ImageSource, options: FlipOptions): Promise<Blob> {
    const manipulateOptions: ManipulateOptions = {
        flipHorizontally: options.horizontally,
        flipVertically: options.vertically,
    }
    return await manipulate(source, manipulateOptions);
}

export async function rotate(source: ImageSource, options: RotateOptions): Promise<Blob> {
    const manipulateOptions: ManipulateOptions = {
        rotateAngle: options.angle,
    }
    return await manipulate(source, manipulateOptions);
}

export async function resize(source: ImageSource, options: ResizeOptions): Promise<Blob> {
    return await manipulate(source, options);
}

export async function manipulate(source: ImageSource, options: ManipulateOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);

    const defaultOptions = getDefaultOptions(source, image);
    const { format, width, height, quality, flipHorizontally, flipVertically, rotateAngle } = { ...defaultOptions, ...options };

    const [canvas, context] = createCanvas(width, height);

    context.translate(canvas.width / 2, canvas.height / 2);

    if (flipHorizontally || flipVertically) {
        const horizontalScale = flipHorizontally ? -1 : 1;
        const verticalScale = flipVertically ? -1 : 1;
        context.scale(horizontalScale, verticalScale);
    }

    if (rotateAngle !== 0) {
        context.rotate(rotateAngle);
    }

    context.drawImage(image, -image.width / 2, -image.height / 2);
    return await canvasToBlob(canvas, { format, quality });
}

export async function loadImage(source: ImageSource): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        image.src = URL.createObjectURL(source);
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    });
}

export function getDefaultOptions(source: ImageSource, image: HTMLImageElement): ImageOptions {
    return {
        format: source.type as ImageFormat,
        width: image.width,
        height: image.height,
        quality: 1,
        flipHorizontally: false,
        flipVertically: false,
        rotateAngle: 0,
    }
}

type Canvas = HTMLCanvasElement | OffscreenCanvas;
type CanvasContext2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

async function canvasToBlob(canvas: Canvas, options: ConvertOptions): Promise<Blob> {
    const { format, quality } = options;

    if (canvas instanceof HTMLCanvasElement) {
        return await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(b => {
                if (!b) {
                    reject(new Error(`The "${format}" is not supported by the browser`));
                } else {
                    resolve(b as Blob);
                }
            }, format, quality);
        });
    } else {
        return await canvas.convertToBlob({ type: format, quality })
    }
}

function createCanvas(width: number, height: number): [Canvas, CanvasContext2D] {
    let canvas: Canvas;
    let context: CanvasContext2D | null;

    if (typeof OffscreenCanvas !== 'undefined') {
        canvas = new OffscreenCanvas(width, height);
        context = (canvas as OffscreenCanvas).getContext('2d');
    } else {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = width;
        canvasElement.height = height;
        canvas = canvasElement;
        context = canvasElement.getContext('2d');
    }

    if (!context) throw new Error('Failed to create 2D context');
    return [canvas, context];
}