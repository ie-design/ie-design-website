import { isLandscape } from "./layout";
import { Signal } from "./signal";

export const body = document.body;
export const bodySig = new Signal();
window.onresize = bodySig.update;

export const ieBlue = "#609CCE";
export const ieGreen = "#bfe021";
export const gray = "#808080";

export const fadeInAnimation = () => `fadeIn${isLandscape() ? "X" : "Y"} ease 0.6s`;

export const NEXT_PILLAR_BUTTON_PAD = 0.1;