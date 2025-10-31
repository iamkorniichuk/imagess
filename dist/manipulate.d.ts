import { ImageOptions, ImageSource } from "./image";
export interface ManipulateOptions extends Partial<ImageOptions> {
}
export declare function manipulate(source: ImageSource, options: ManipulateOptions): Promise<Blob>;
