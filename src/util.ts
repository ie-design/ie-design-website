import { fadeInAnimation } from "./constants";

export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

export function spaceToFile(s: string) {
    return s.replace(" ", "-");
}

export function createElementSVG<K extends keyof SVGElementTagNameMap>(qualifiedName: K) {
    return document.createElementNS("http://www.w3.org/2000/svg", qualifiedName);
}

export function interlaced<T, Within>(items: T[], within: Within) {
    const itemsInterlaced = [];
    for (const item of items) {
        itemsInterlaced.push(item);
        itemsInterlaced.push(within);
    }
    itemsInterlaced.pop();
    return itemsInterlaced;
}

export function mapRange(n: number, start1: number, stop1: number, start2: number, stop2: number) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

const colorOnHoverGeneric =
    <T extends HTMLElement | SVGSVGElement>(field: string) =>
    (element: T, color: string, hoverColor: string) => {
        element.style.setProperty(field, color);
        element.onmouseover = () => element.style.setProperty(field, hoverColor);
        element.onmouseleave = () => element.style.setProperty(field, color);
        element.style.transition = `${field} 0.2s ease-out`;
    };

export const colorOnHover = colorOnHoverGeneric<HTMLElement>("color");
export const colorOnHoverSVG = colorOnHoverGeneric<SVGSVGElement>("fill");

export function setAttributes(element: Element, attributes: Record<string, any>) {
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
}

export async function fetchSVG(fetchString: string) {
    const response = await fetch(fetchString);
    const svgContent = await response.text();
    return new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement as unknown as SVGSVGElement;
}

export function getElementByIdSVG(svg: SVGSVGElement, id: string) {
    return svg.getElementById(id) as SVGElement;
}

export function createIconSVG(localSize: number) {
    const icon = createElementSVG("svg");
    const pad = 4;
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.setAttribute("viewBox", `${-pad} ${-pad} ${localSize + 2 * pad} ${localSize + 2 * pad}`);
    return icon;
}

export const makeLine = (svg: SVGSVGElement, strokeWidth: number) => () => {
    const line = createElementSVG("line");
    setAttributes(line, { "stroke-width": strokeWidth });
    svg.appendChild(line);
    return line;
};

export const makePolyline = (svg: SVGSVGElement, strokeWidth: number) => () => {
    const line = createElementSVG("polyline");
    setAttributes(line, { "stroke-width": strokeWidth, fill: "none" });
    svg.appendChild(line);
    return line;
};
