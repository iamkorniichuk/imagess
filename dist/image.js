export async function loadImage(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(source);
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    });
}
export function getDefaultOptions(source, image) {
    return {
        format: source.type,
        width: image.width,
        height: image.height,
        quality: 1,
        flipHorizontally: false,
        flipVertically: false,
        rotateAngle: 0,
    };
}
