export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif';
export type ImageSource = HTMLImageElement | File | Blob | string;

export interface ConvertOptions {
    format: ImageFormat;
    quality?: number;
};
export interface FlipOptions extends ConvertOptions {
    horizontally: boolean;
    vertically: boolean;
}
export interface ResizeOptions extends ConvertOptions {
    width: number;
    height: number;
}

export interface ManipulateOptions {
    format: ImageFormat;
    width: number;
    height: number;
    quality?: number;
    flipHorizontally?: boolean;
    flipVertically?: boolean;
}

export async function convert(source: ImageSource, options: ConvertOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);
    const manipulateOptions: ManipulateOptions = {
        ...options,
        width: image.width,
        height: image.height
    }
    return await manipulate(source, manipulateOptions);
}

export async function flip(source: ImageSource, options: FlipOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);
    const manipulateOptions: ManipulateOptions = {
        ...options,
        width: image.width,
        height: image.height,
        flipHorizontally: options.horizontally,
        flipVertically: options.vertically,
    }
    return await manipulate(source, manipulateOptions);
}

export async function resize(source: ImageSource, options: ResizeOptions): Promise<Blob> {
    return await manipulate(source, options);
}

export async function manipulate(source: ImageSource, options: ManipulateOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);
    const { format, width, height, quality = 0.9, flipHorizontally = false, flipVertically = false } = options;

    const [canvas, context] = createCanvas(width, height);

    context.translate(canvas.width / 2, canvas.height / 2);
    context.drawImage(image, -image.width / 2, -image.height / 2);

    if (flipHorizontally || flipVertically) {
        const horizontalScale = flipHorizontally ? -1 : 1;
        const verticalScale = flipVertically ? -1 : 1;
        context.scale(horizontalScale, verticalScale);
    }

    return await canvasToBlob(canvas, { format, quality });
}

export async function loadImage(source: ImageSource): Promise<HTMLImageElement> {
    if (source instanceof HTMLImageElement) return source;

    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        if (typeof source !== 'string') {
            image.src = URL.createObjectURL(source);
        } else {
            image.crossOrigin = 'anonymous';
            image.src = source;
        }
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    });
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