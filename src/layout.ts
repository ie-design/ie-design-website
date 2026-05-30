import { interlaced } from "./util";

interface ElementAlignment {
    element: BoxElement;
    offset: number;
}

export interface TextDetails {
    letterSpacing: number;
    fontWeight: number;
    color: string;
    fontSize: number;
    width?: number;
    lineHeight: number;
}

export type BoxElement = HTMLElement | SVGSVGElement;

export function px(pixels: number) {
    return pixels + "px";
}

function axisAligningWithGaps(axisSize: (element: BoxElement) => number) {
    return (elementOrGaps: (BoxElement | number)[]): [ElementAlignment[], number] => {
        const elementAlignments = [];
        let runningTotal = 0;
        for (const elementOrGap of elementOrGaps) {
            if (elementOrGap instanceof HTMLElement || elementOrGap instanceof SVGSVGElement) {
                elementAlignments.push({ element: elementOrGap, offset: runningTotal });
                runningTotal += axisSize(elementOrGap);
            } else {
                runningTotal += elementOrGap;
            }
        }
        return [elementAlignments, runningTotal];
    };
}

function unpx(value: string) {
    return Number(value.slice(0, -2));
}
export function posX(element: BoxElement) {
    return element instanceof HTMLElement ? element.offsetLeft : unpx(element.style.left);
}

export function posY(element: BoxElement) {
    return element instanceof HTMLElement ? element.offsetTop : unpx(element.style.top);
}

export function sizeX(element: BoxElement) {
    return element instanceof HTMLElement ? element.offsetWidth : element.clientWidth;
}

export function sizeY(element: BoxElement) {
    return element instanceof HTMLElement ? element.offsetHeight : element.clientHeight;
}

// ZZZZ want a short hand for common simple use
export const aligningWithGapsX = axisAligningWithGaps(sizeX);
export const aligningWithGapsY = axisAligningWithGaps(sizeY);

export function isLandscape() {
    return innerWidth / innerHeight > 1;
}

export function centerWithGapY(elements: HTMLElement[], gap: number, center: number) {
    const elementsWithGaps = interlaced(elements, gap);
    const [elementAlignments, totalHeight] = aligningWithGapsY(elementsWithGaps);

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(offset + center - totalHeight / 2);
    }
}

export function centerElementX(element: HTMLElement) {
    element.style.left = px(innerWidth / 2 - sizeX(element) / 2);
}

export function centerElementY(element: HTMLElement) {
    element.style.top = px(innerHeight / 2 - sizeY(element) / 2);
}

export function setImageWidth(image: HTMLImageElement, width: number) {
    image.style.width = px(width);
    image.style.height = px((width / image.naturalWidth) * image.naturalHeight);
}

export function setImageHeight(image: HTMLImageElement, height: number) {
    image.style.height = px(height);
    image.style.width = px((height / image.naturalHeight) * image.naturalWidth);
}

export function styleText(scrollText: HTMLElement, s: TextDetails) {
    scrollText.style.fontFamily = "Spartan";
    scrollText.style.position = "absolute";
    scrollText.style.fontWeight = "" + s.fontWeight;
    scrollText.style.color = s.color;
    scrollText.style.letterSpacing = px(s.letterSpacing);
    scrollText.style.fontSize = px(s.fontSize);
    if (s.width) scrollText.style.width = px(s.width);
    scrollText.style.lineHeight = px(s.lineHeight);
}
