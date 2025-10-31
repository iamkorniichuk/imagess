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
export declare function loadImage(source: ImageSource): Promise<HTMLImageElement>;
export declare function getDefaultOptions(source: ImageSource, image: HTMLImageElement): ImageOptions;
