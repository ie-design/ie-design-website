import { bodySig } from "./constants";
import { effect } from "./signal";

const pageCleanups = new Set<() => void>();
const awaitBeforeLayouts = new Set<Promise<void>>();
const beforeLayouts = new Set<() => void>();

awaitBeforeLayouts.add(Promise.all([...document.fonts].map((f) => f.load())).then(() => {}));

export function awaitLayout(promise: Promise<void>) {
    awaitBeforeLayouts.add(promise);
}

export async function flushPageContent() {
    await Promise.all(awaitBeforeLayouts);
    awaitBeforeLayouts.clear();
    runAllAndClear(beforeLayouts);
}

export const shouldElementOutlastPage = new Set<Element>();

export function appendChildForPage(parent: Element, child: Element) {
    beforeLayouts.add(() => {
        parent.appendChild(child);
        pageCleanups.add(() => {
            if (!shouldElementOutlastPage.has(child)) parent.removeChild(child);
            else appendChildForPage(parent, child); // try again for next page cleanup
        });
    });
}

export async function registerUpdateLayout(updateLayout: () => void) {
    await flushPageContent();
    effect(updateLayout, [bodySig]);
    pageCleanups.add(() => bodySig.unsubscribe(updateLayout));
}

export function cleanLastPage() {
    runAllAndClear(pageCleanups);
}

export function runAllAndClear(set: Set<() => void>) {
    for (const item of set) item();
    set.clear();
}
