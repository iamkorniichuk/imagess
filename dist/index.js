import { manipulate } from "./manipulate";
;
export async function convert(source, options) {
    return await manipulate(source, options);
}
export async function flip(source, options) {
    const manipulateOptions = {
        flipHorizontally: options.horizontally,
        flipVertically: options.vertically,
    };
    return await manipulate(source, manipulateOptions);
}
export async function rotate(source, options) {
    const manipulateOptions = {
        rotateAngle: options.angle,
    };
    return await manipulate(source, manipulateOptions);
}
export async function resize(source, options) {
    return await manipulate(source, options);
}
export { manipulate } from "./manipulate";
