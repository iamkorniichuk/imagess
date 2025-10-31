export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif';
export type ImageSource = File | Blob;
export interface ImageOptions {
    format: ImageFormat;
    width: number;
    height: number;
    quality: number;
    flipHorizontally: boolean;
    flipVertically: boolean;
    rotateAngle: number;
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