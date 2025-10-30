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
        format: options.format,
        quality: options.quality,
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

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(b => resolve(b as Blob), format, quality);
    });
    return blob;
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

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to create 2D context');

    return [canvas, context];
}