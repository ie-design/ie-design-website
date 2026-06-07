export interface TextStyle {
    letterSpacing: number;
    fontWeight: number;
    color: string;
    fontSize: number;
}

export interface MultiLineTextStyle extends TextStyle {
    lineHeight: number;
}

export type BoxElement = HTMLElement | SVGSVGElement;

export function px(pixels: number) {
    return pixels + "px";
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

export function isLandscape() {
    return innerWidth / innerHeight > 1;
}

// export function setImageWidth(image: HTMLImageElement, width: number) {
//     image.style.width = px(width);
//     image.style.height = px((width / image.naturalWidth) * image.naturalHeight);
// }

// export function setImageHeight(image: HTMLImageElement, height: number) {
//     image.style.height = px(height);
//     image.style.width = px((height / image.naturalHeight) * image.naturalWidth);
// }

function styleText(scrollText: BoxElement, s: TextStyle) {
    scrollText.style.fontFamily = "Spartan";
    scrollText.style.position = "absolute";
    scrollText.style.fontWeight = "" + s.fontWeight;
    scrollText.style.color = s.color;
    scrollText.style.letterSpacing = px(s.letterSpacing);
    scrollText.style.fontSize = px(s.fontSize);
}

export function styleMultiLineText(scrollText: BoxElement, s: MultiLineTextStyle) {
    styleText(scrollText, s);
    scrollText.style.lineHeight = px(s.lineHeight);
}

export function styleSingleLineText(scrollText: BoxElement, s: TextStyle) {
    styleText(scrollText, s);
    scrollText.style.lineHeight = "normal";
    scrollText.style.whiteSpace = "nowrap";
}

export function lastLineMetrics(textEl: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(textEl);
    const rects = range.getClientRects();
    const first = rects[0];
    const last = rects[rects.length - 1];
    return { width: last.width, top: last.top - first.top };
}
