export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
export const onEvent = (target: EventTarget, event: string) =>
    new Promise<void>((resolve) => target.addEventListener(event, () => resolve(), { once: true }));

export function spaceToFile(s: string) {
    return s.replace(" ", "-");
}

export function createElementSVG<K extends keyof SVGElementTagNameMap>(qualifiedName: K) {
    return document.createElementNS("http://www.w3.org/2000/svg", qualifiedName);
}

export function interlaceWithBetween<T, Within>(items: T[], within: Within) {
    const itemsInterlaced = [];
    for (const item of items) {
        itemsInterlaced.push(item);
        itemsInterlaced.push(within);
    }
    itemsInterlaced.pop();
    return itemsInterlaced;
}

export function interlaceWithFactory<T, Within>(items: T[], make: () => Within) {
    const itemsInterlaced: (T | Within)[] = [];
    for (let i = 0; i < items.length; i++) {
        itemsInterlaced.push(items[i]);
        if (i < items.length - 1) itemsInterlaced.push(make());
    }
    return itemsInterlaced;
}

export function findWithMin<T>(items: T[], key: (item: T) => number): T {
    let best = items[0];
    let bestKey = key(best);
    for (let i = 1; i < items.length; i++) {
        const k = key(items[i]);
        if (k < bestKey) {
            bestKey = k;
            best = items[i];
        }
    }
    return best;
}

export function mapRange(n: number, start1: number, stop1: number, start2: number, stop2: number) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

const hoverControllers = new WeakMap<Element, AbortController>();

const colorOnHoverGeneric =
    <T extends HTMLElement | SVGSVGElement>(field: string) =>
    (element: T, color: string, hoverColor: string) => {
        element.style.setProperty(field, color);

        hoverControllers.get(element)?.abort();
        const ac = new AbortController();
        hoverControllers.set(element, ac);

        element.addEventListener("mouseenter", () => element.style.setProperty(field, hoverColor), { signal: ac.signal });
        element.addEventListener("mouseleave", () => element.style.setProperty(field, color), { signal: ac.signal });

        if (element.matches(":hover")) element.style.setProperty(field, hoverColor);
        element.style.transition = `${field} 0.2s ease-out`;
    };

export const colorOnHover = colorOnHoverGeneric<HTMLElement>("color");
export const colorOnHoverSVGFill = colorOnHoverGeneric<SVGSVGElement>("fill");
export const colorOnHoverSVGStroke = colorOnHoverGeneric<SVGSVGElement>("stroke");

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

export async function loadSVGInto(svg: SVGSVGElement, src: string) {
    const fetched = await fetchSVG(src);
    for (const attr of fetched.attributes) svg.setAttribute(attr.name, attr.value);
    while (fetched.firstChild) svg.appendChild(fetched.firstChild);
    svg.style.position = "absolute";
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

export function setPolylines(make: () => SVGPolylineElement, ...segments: [number, number][][]) {
    for (const pts of segments) {
        setAttributes(make(), { points: pts.map(([x, y]) => `${x},${y}`).join(" ") });
    }
}

export function interleaveArrays<A, B>(...arrays: (A | B)[][]): (A | B)[] {
    const result: (A | B)[] = [];
    const maxLength = Math.max(...arrays.map((a) => a.length));
    for (let i = 0; i < maxLength; i++) {
        for (const array of arrays) {
            if (i < array.length) result.push(array[i]);
        }
    }
    return result;
}

export function appendParagraph(p: HTMLParagraphElement, ...nodes: (string | Node)[]) {
    p.append(...nodes);
    return p;
}

export function bold(text: string) {
    const span = document.createElement("span");
    span.innerText = text;
    span.style.fontWeight = "700";
    return span;
}

export const camelToKebab = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^_/, "");
