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
    // ieBlue: "#0e00a7",
    // ieGreen: "#00da54",
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
window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "t") {
        selectedTheme = selectedTheme === light ? dark : light;
        applyTheme();
    }
});
