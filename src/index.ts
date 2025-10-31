import { manipulate, ManipulateOptions } from "./manipulate";
import { ImageFormat, ImageSource } from "./image";

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

export { ManipulateOptions, manipulate } from "./manipulate";
export * from "./image";
export * from "./canvas";