import { bodySig } from "./constants";
import { effect } from "./signal";
import { sleep } from "./util";

export const pageCleanups = new Set<() => void>();

const awaitBeforeLayouts = new Set<Promise<void>>();
const beforeLayouts = new Set<() => void>();

export function awaitLayoutForImageLoading(image: HTMLImageElement) {
    awaitBeforeLayouts.add(image.decode());
}

// TODO gross
export async function wahhh() {
    await Promise.all(awaitBeforeLayouts);
    awaitBeforeLayouts.clear();
    await sleep(10);
    runAllAndClear(beforeLayouts);
    bodySig.update(); // TODO gross
}

export async function registerUpdateLayout(updateLayout: () => void) {
    await wahhh();
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
