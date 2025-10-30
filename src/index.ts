export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif';
export type ImageSource = HTMLImageElement | File | Blob | string;

export interface ConvertOptions {
    format: ImageFormat;
    quality?: number;
};
export interface ResizeOptions extends ConvertOptions {
    width: number;
    height: number;
}

export async function convert(source: ImageSource, options: ConvertOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);
    const resizeOptions: ResizeOptions = {
        ...options,
        width: image.width,
        height: image.height
    }
    return await resize(source, resizeOptions);
}

export async function resize(source: ImageSource, options: ResizeOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);
    const { format, quality = 0.9, width, height } = options;

    const [canvas, context] = createCanvas(width, height);
    context.drawImage(image, 0, 0, width, height);

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
        return await new Promise<Blob>((resolve) => {
            canvas.toBlob(b => resolve(b as Blob), format, quality);
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