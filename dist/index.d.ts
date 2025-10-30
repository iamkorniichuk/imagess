export declare type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif';
export declare type ImageSource = HTMLImageElement | File | Blob | string;
export interface ConvertOptions {
    format: ImageFormat;
    quality?: number;
}
export interface ResizeOptions extends ConvertOptions {
    width: number;
    height: number;
}
export declare function convert(source: ImageSource, options: ConvertOptions): Promise<Blob>;
export declare function resize(source: ImageSource, options: ResizeOptions): Promise<Blob>;
export declare function loadImage(source: ImageSource): Promise<HTMLImageElement>;
