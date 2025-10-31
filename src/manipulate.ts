import { getDefaultOptions, ImageOptions, ImageSource, loadImage } from "./image";
import { canvasToBlob, createCanvas } from "./canvas";


export interface ManipulateOptions extends Partial<ImageOptions> { }

export async function manipulate(source: ImageSource, options: ManipulateOptions): Promise<Blob> {
    const image: HTMLImageElement = await loadImage(source);

    const defaultOptions = getDefaultOptions(source, image);
    const { format, width, height, quality, flipHorizontally, flipVertically, rotateAngle } = { ...defaultOptions, ...options };

    const [canvas, context] = createCanvas(width, height);

    context.translate(canvas.width / 2, canvas.height / 2);

    if (flipHorizontally || flipVertically) {
        const horizontalScale = flipHorizontally ? -1 : 1;
        const verticalScale = flipVertically ? -1 : 1;
        context.scale(horizontalScale, verticalScale);
    }

    if (rotateAngle !== 0) {
        context.rotate(rotateAngle);
    }

    context.drawImage(image, -image.width / 2, -image.height / 2);
    return await canvasToBlob(canvas, { format, quality });
}
