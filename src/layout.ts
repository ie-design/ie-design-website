import { interlaceWithBetween } from "./util";

interface ElementAlignment {
    element: BoxElement;
    offset: number;
}

export interface TextStyle {
    letterSpacing: number;
    fontWeight: number;
    color: string;
    fontSize: number;
}

export interface TextDetails extends TextStyle {
    lineHeight: number; // multi-line text always sets an explicit line height
}

export type BoxElement = HTMLElement | SVGSVGElement;
export type LayoutItem = BoxElement | BoxElement[] | number;

export function px(pixels: number) {
    return pixels + "px";
}

function axisAligningWithGaps(axisSize: (element: BoxElement) => number) {
    return (elementsOrGaps: LayoutItem[]): [ElementAlignment[], number] => {
        const elementAlignments: ElementAlignment[] = [];
        let runningTotal = 0;
        for (const item of elementsOrGaps) {
            if (Array.isArray(item)) {
                for (const element of item) elementAlignments.push({ element, offset: runningTotal });
                runningTotal += Math.max(...item.map(axisSize));
            } else if (item instanceof HTMLElement || item instanceof SVGSVGElement) {
                elementAlignments.push({ element: item, offset: runningTotal });
                runningTotal += axisSize(item);
            } else {
                runningTotal += item;
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

export const aligningWithGapsX = axisAligningWithGaps(sizeX);
export const aligningWithGapsY = axisAligningWithGaps(sizeY);

export function isLandscape() {
    return innerWidth / innerHeight > 1;
}

export function centerWithGapY(elements: HTMLElement[], gap: number, center: number) {
    const elementsWithGaps = interlaceWithBetween(elements, gap);
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

function applyTextStyle(scrollText: HTMLElement, s: TextStyle) {
    scrollText.style.fontFamily = "Spartan";
    scrollText.style.position = "absolute";
    scrollText.style.fontWeight = "" + s.fontWeight;
    scrollText.style.color = s.color;
    scrollText.style.letterSpacing = px(s.letterSpacing);
    scrollText.style.fontSize = px(s.fontSize);
}

// Multi-line text: wraps within an externally-set width (setSizeX) and always has an explicit line height.
export function styleText(scrollText: HTMLElement, s: TextDetails) {
    applyTextStyle(scrollText, s);
    scrollText.style.lineHeight = px(s.lineHeight);
}

// Single-line text: never wraps and takes no line height, so its box is font-intrinsic and hugs the text.
export function styleSingleLineText(scrollText: HTMLElement, s: TextStyle) {
    applyTextStyle(scrollText, s);
    scrollText.style.lineHeight = "normal";
    scrollText.style.whiteSpace = "nowrap";
}

export function setSizeX(element: BoxElement, value: number) {
    element.style.width = px(value);
}

export function setSizeY(element: BoxElement, value: number) {
    element.style.height = px(value);
}

export function setPosX(element: BoxElement, value: number) {
    element.style.left = px(value);
}

export function setPosY(element: BoxElement, value: number) {
    element.style.top = px(value);
}

// width and top offset of a text element's last rendered line, both position-independent (depend only on wrapping)
export function lastLineMetrics(textEl: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(textEl);
    const rects = range.getClientRects();
    const first = rects[0];
    const last = rects[rects.length - 1];
    return { width: last.width, top: last.top - first.top };
}

export function layout(size: () => void, position: () => void, postPosition?: () => void) {
    size();
    position();
    postPosition?.();
}

export const NEXT_PILLAR_BUTTON_PAD = 0.1;
export function layoutNextPillarButton(nextPillarButton: HTMLElement, s: number) {
    nextPillarButton.style.top = px((s - sizeY(nextPillarButton)) / 2);
}