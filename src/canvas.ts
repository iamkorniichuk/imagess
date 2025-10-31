import { ConvertOptions } from ".";

type Canvas = HTMLCanvasElement | OffscreenCanvas;
type CanvasContext2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;


export async function canvasToBlob(canvas: Canvas, options: ConvertOptions): Promise<Blob> {
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

export function createCanvas(width: number, height: number): [Canvas, CanvasContext2D] {
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