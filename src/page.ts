import { bodySig } from "./constants";
import { effect } from "./signal";

export const pageCleanups = new Set<() => void>();

const awaitBeforeLayouts = new Set<Promise<void>>();
const beforeLayouts = new Set<() => void>();

export function awaitLayoutForImageLoading(image: HTMLImageElement) {
    awaitBeforeLayouts.add(image.decode());
}

export async function flushPageContent() {
    await Promise.all(awaitBeforeLayouts);
    awaitBeforeLayouts.clear();
    await new Promise(requestAnimationFrame);
    runAllAndClear(beforeLayouts);
}

export async function registerUpdateLayout(updateLayout: () => void) {
    await flushPageContent();
    effect(updateLayout, [bodySig]);
    pageCleanups.add(() => bodySig.unsubscribe(updateLayout));
}

export function appendChildForPage(parent: Element, child: Element) {
    beforeLayouts.add(() => {
        parent.appendChild(child);
        pageCleanups.add(() => parent.removeChild(child));
    });
}

export function cleanLastPage() {
    runAllAndClear(pageCleanups);
}

function runAllAndClear(set: Set<() => void>) {
    for (const item of set) item();
    set.clear();
}
