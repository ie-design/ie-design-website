import { isLandscape } from "./layout";
import { Signal } from "./signal";

export const body = document.body;
export const bodySig = new Signal();
window.onresize = bodySig.update;

export const fadeInAnimation = () => `fadeIn${isLandscape() ? "X" : "Y"} ease 0.6s`;
