import { ImageFormat, ImageSource } from "./image";
export interface ConvertOptions {
    format: ImageFormat;
    quality?: number;
}
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
export declare function convert(source: ImageSource, options: ConvertOptions): Promise<Blob>;
export declare function flip(source: ImageSource, options: FlipOptions): Promise<Blob>;
export declare function rotate(source: ImageSource, options: RotateOptions): Promise<Blob>;
export declare function resize(source: ImageSource, options: ResizeOptions): Promise<Blob>;
export { ManipulateOptions, manipulate } from "./manipulate";
export * from "./image";
export * from "./canvas";
