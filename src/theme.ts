import { camelToKebab } from "./util";

const light = {
    ieBlue: "#609cce",
    ieGreen: "#bfe021",
    ieText: "#231f20",

    background: "#ffffff",
    bodyText: "#000000",

    neutralBack: "#e6e6e6",
    neutralFront: "#b3b3b3",
    neutral: "#808080",

    menuModalOverlay: "#000000f8",
    imageModalOverlay: "#ffffffee",
};

const dark = {
    ieBlue: "#609cce",
    ieGreen: "#bfe021",
    // ieBlue: "#ff58ec",
    // ieGreen: "#ffa200",
    ieText: "#231f20",

    background: "#1a1a1a",
    bodyText: "#f2f2f2",

    neutralBack: "#555555",
    neutralFront: "#aaaaaa",
    neutral: "#808080",

    menuModalOverlay: "#000000f8",
    imageModalOverlay: "#1a1a1aee",
};

type Theme = typeof light;
const cssVars = Object.fromEntries(Object.keys(light).map((key) => [key, `--${camelToKebab(key)}`])) as Record<keyof Theme, string>;
export const theme = Object.fromEntries(Object.keys(light).map((key) => [key, `var(${cssVars[key as keyof Theme]})`])) as Theme;

export const themes = { light, dark };

export let selectedTheme = light;

export function applyTheme() {
    for (const key of Object.keys(light) as (keyof Theme)[]) {
        document.documentElement.style.setProperty(cssVars[key], selectedTheme[key]);
    }
}

applyTheme();

document.body.style.backgroundColor = theme.background;
// document.body.style.userSelect = "none";
document.body.style.setProperty("-webkit-user-select", "none");
function toggleTheme() {
    const style = document.createElement("style");
    style.textContent = "* { transition: color 0.4s ease, background-color 0.4s ease, background 0.4s ease, fill 0.1s ease, stroke 0.4s ease; }";
    document.head.appendChild(style);
    selectedTheme = selectedTheme === light ? dark : light;
    applyTheme();
    setTimeout(() => document.head.removeChild(style), 500);
}

window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "t") toggleTheme();
});

export function setupLogoThemeToggle(logo: SVGSVGElement) {
    // logo.style.touchAction = "none";
    // logo.style.setProperty("-webkit-touch-callout", "none");
    // logo.addEventListener("contextmenu", (e) => e.preventDefault());

    let timer: ReturnType<typeof setTimeout> | undefined;
    let swapped = false;
    logo.addEventListener("pointerdown", (e) => {
        
        swapped = false;
        timer = setTimeout(() => { swapped = true; toggleTheme(); }, 1000);
    });
    const cancel = () => clearTimeout(timer);
    logo.addEventListener("pointerup", cancel);
    logo.addEventListener("pointercancel", cancel);
    logo.addEventListener("pointerleave", cancel);
    logo.addEventListener("click", (e) => { if (swapped) e.stopImmediatePropagation(); }, { capture: true });
}
