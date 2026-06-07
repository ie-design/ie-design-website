import { isLandscape } from "./layout";
import { effect, Signal } from "./signal";

export const body = document.body;
export const bodySig = new Signal();
window.onresize = bodySig.update;

const light = {
    ieBlue: "#609cce",
    ieGreen: "#bfe021",
    gray: "#808080",
    black: "#000000",
    white: "#ffffff",
    textMutedColor: "#b3b3b3",
    workTextColor: "#333333",
    menuButtonGray: "#bbbbbb",
    menuOverlayBg: "#000000f8",
    imageModalBg: "#ffffffee",
};

const dark = {
    ieBlue: "#7ab8e8",
    ieGreen: "#d4f52e",
    gray: "#808080",
    black: "#f2f2f2",
    white: "#1a1a1a",
    textMutedColor: "#666666",
    workTextColor: "#cccccc",
    menuButtonGray: "#444444",
    menuOverlayBg: "#000000f8",
    imageModalBg: "#1a1a1aee",
};

export const themes = { light, dark };

export const { ieBlue, ieGreen, gray, black, white, textMutedColor, workTextColor, menuButtonGray, menuOverlayBg, imageModalBg } = light;

effect(() => {
    body.style.backgroundColor = white;
}, [bodySig]);

export const fadeInAnimation = () => `fadeIn${isLandscape() ? "X" : "Y"} ease 0.6s`;
