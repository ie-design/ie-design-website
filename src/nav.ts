const listeners: ((hidden: boolean) => void)[] = [];

export function setNavHidden(hidden: boolean) {
    for (const fn of listeners) fn(hidden);
}

export function registerNavHidden(fn: (hidden: boolean) => void) {
    listeners.push(fn);
}
