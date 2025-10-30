;
export async function convert(source, options) {
    const image = await loadImage(source);
    const resizeOptions = {
        format: options.format,
        quality: options.quality,
        width: image.width,
        height: image.height
    };
    return await resize(source, resizeOptions);
}
export async function resize(source, options) {
    const image = await loadImage(source);
    const { format, quality = 0.9, width, height } = options;
    const [canvas, context] = createCanvas(width, height);
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise((resolve) => {
        canvas.toBlob(b => resolve(b), format, quality);
    });
    return blob;
}
export async function loadImage(source) {
    if (source instanceof HTMLImageElement)
        return source;
    return new Promise((resolve, reject) => {
        const image = new Image();
        if (typeof source !== 'string') {
            image.src = URL.createObjectURL(source);
        }
        else {
            image.crossOrigin = 'anonymous';
            image.src = source;
        }
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    });
}
function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error('Failed to create 2D context');
    return [canvas, context];
}
