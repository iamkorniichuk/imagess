export async function canvasToBlob(canvas, options) {
    const { format, quality } = options;
    if (canvas instanceof HTMLCanvasElement) {
        return await new Promise((resolve, reject) => {
            canvas.toBlob(b => {
                if (!b) {
                    reject(new Error(`The "${format}" is not supported by the browser`));
                }
                else {
                    resolve(b);
                }
            }, format, quality);
        });
    }
    else {
        return await canvas.convertToBlob({ type: format, quality });
    }
}
export function createCanvas(width, height) {
    let canvas;
    let context;
    if (typeof OffscreenCanvas !== 'undefined') {
        canvas = new OffscreenCanvas(width, height);
        context = canvas.getContext('2d');
    }
    else {
        const canvasElement = document.createElement('canvas');
        canvasElement.width = width;
        canvasElement.height = height;
        canvas = canvasElement;
        context = canvasElement.getContext('2d');
    }
    if (!context)
        throw new Error('Failed to create 2D context');
    return [canvas, context];
}
