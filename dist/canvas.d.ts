import { ConvertOptions } from ".";
type Canvas = HTMLCanvasElement | OffscreenCanvas;
type CanvasContext2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
export declare function canvasToBlob(canvas: Canvas, options: ConvertOptions): Promise<Blob>;
export declare function createCanvas(width: number, height: number): [Canvas, CanvasContext2D];
export {};
