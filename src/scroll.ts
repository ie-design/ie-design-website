import { isLandscape, px } from "./layout";
import { appendChildForPage, awaitLayout, bodySig, fadeInAnimation } from "./page";
import { pillars, site } from "./site";
import { theme } from "./theme";
import { animateOnEnter, colorOnHover, createElementSVG, loadSVGInto } from "./util";

export interface TextSquare {
    major: HTMLElement;
    minors: HTMLElement[];
}

const APPROXIMATE_SCROLL_BAR_HEIGHT = 12;

const ieBlueTranslucent = `color-mix(in srgb, ${theme.ieBlue} 30%, transparent)`;

const scrollbarCSS = document.createElement("style");
scrollbarCSS.textContent = `
    ::-webkit-scrollbar { height: ${APPROXIMATE_SCROLL_BAR_HEIGHT}px; width: ${APPROXIMATE_SCROLL_BAR_HEIGHT}px; }
    ::-webkit-scrollbar-thumb { background: ${theme.ieGreen}; }
    ::-webkit-scrollbar-track { background: ${ieBlueTranslucent}; }
`;
document.head.appendChild(scrollbarCSS);

export const scrollContainer = document.createElement("div");
scrollContainer.style.position = "absolute";
scrollContainer.style.scrollbarWidth = "thin";
scrollContainer.style.scrollbarColor = `${theme.ieGreen} ${ieBlueTranslucent}`;
document.body.appendChild(scrollContainer);

scrollContainer.onwheel = (e) => e.preventDefault();
window.onwheel = (e) => {
    // if (scrollContainer.style.overflowY === "scroll") scrollContainer.scrollTop += e.deltaY;
    // else scrollContainer.scrollLeft += e.deltaX + e.deltaY;
    if (scrollContainer.style.overflowY === "scroll") scrollContainer.scrollBy({ top: e.deltaY, left: e.deltaX });
    else scrollContainer.scrollBy({ left: e.deltaX + e.deltaY });
};

export function resizeScrollContainerLandscape() {
    const scrollHeight = getScrollHeight();

    const scrollLeft = scrollHeight * 0.5;

    const underScrollContainer = (innerHeight - scrollHeight) / 2;
    scrollContainer.style.height = px(scrollHeight + (underScrollContainer + APPROXIMATE_SCROLL_BAR_HEIGHT) / 2); // place scroll bar centered in gap below scroll area
    scrollContainer.style.width = px(innerWidth - scrollLeft);
    scrollContainer.style.top = px((innerHeight - scrollHeight) / 2);
    scrollContainer.style.left = px(scrollLeft);

    scrollContainer.style.overflowX = "scroll";
    scrollContainer.style.overflowY = "hidden";
    scrollContainer.scrollTop = 0;
}

export function resizeScrollContainerPortrait() {
    const scrollWidth = getScrollWidth();
    const headerBarHeight = getHeaderBarHeight();
    scrollContainer.style.width = px(scrollWidth);
    scrollContainer.style.height = px(innerHeight - headerBarHeight);
    scrollContainer.style.left = px((innerWidth - scrollWidth) / 2);
    scrollContainer.style.top = px(headerBarHeight);

    scrollContainer.style.overflowX = "hidden";
    scrollContainer.style.overflowY = "scroll";
    scrollContainer.scrollLeft = 0;
}

export function resizeScrollContainerFull() {
    const headerBarHeight = getHeaderBarHeight();
    scrollContainer.style.width = px(innerWidth);
    scrollContainer.style.height = px(innerHeight - headerBarHeight);
    scrollContainer.style.left = px(0);
    scrollContainer.style.top = px(headerBarHeight);

    scrollContainer.style.overflowX = "hidden";
    scrollContainer.style.overflowY = "scroll";
    scrollContainer.scrollLeft = 0;
}

export const getHeaderBarHeight = () => {
    if (isLandscape()) {
        return (innerHeight - getScrollHeight()) / 2;
    } else {
        return innerHeight * 0.1;
    }
};

export function addScrollPadding() {
    const scrollPadding = document.createElement("div");
    scrollPadding.style.position = "absolute";
    scrollPadding.style.width = px(1); // any nonzero thickness is enough to extend scrollContainer
    scrollPadding.style.height = px(1);
    appendChildForPage(scrollContainer, scrollPadding);
    return scrollPadding;
}

export function addScrollImage(src: string): HTMLImageElement {
    const scrollImage = document.createElement("img");
    scrollImage.style.position = "absolute";
    // scrollImage.style.transform = "translateZ(0)"; // own compositor layer prevents Safari tile discard
    scrollImage.src = src;
    animateOnEnter(scrollImage, scrollContainer, fadeInAnimation);
    scrollImage.style.cursor = "pointer";

    scrollImage.onclick = () => site.openImage(src);

    awaitLayout(scrollImage.decode().catch(() => console.error(`Failed to decode image: ${src}`)));
    appendChildForPage(scrollContainer, scrollImage);
    return scrollImage;
}

export function addScrollSvg(src: string, shouldAnimateIn: boolean = true) {
    const scrollSvg = createElementSVG("svg");
    scrollSvg.style.position = "absolute";
    if (shouldAnimateIn) animateOnEnter(scrollSvg, scrollContainer, fadeInAnimation);

    awaitLayout(loadSVGInto(scrollSvg, src));

    appendChildForPage(scrollContainer, scrollSvg);
    return scrollSvg;
}

export function addScrollVideo(src: string, poster?: string): HTMLVideoElement {
    const scrollVideo = document.createElement("video");
    scrollVideo.style.position = "absolute";
    scrollVideo.src = src;
    scrollVideo.controls = true;
    scrollVideo.playsInline = true;
    scrollVideo.preload = "auto";
    if (poster) {
        scrollVideo.poster = poster;
        const posterImg = new Image();
        posterImg.src = poster;
        awaitLayout(posterImg.decode().catch(() => {}));
    }
    scrollVideo.addEventListener("loadedmetadata", () => bodySig.update(), { once: true });
    scrollVideo.style.animation = fadeInAnimation();
    appendChildForPage(scrollContainer, scrollVideo);
    return scrollVideo;
}

export function addScrollText(...nodes: (Node | string)[]) {
    const scrollText = document.createElement("p");
    scrollText.append(...nodes);
    scrollText.style.animation = fadeInAnimation();
    appendChildForPage(scrollContainer, scrollText);
    return scrollText;
}

export function addScrollTextSquare(majorText: string, ...minorTexts: string[]): TextSquare {
    const major = addScrollText(majorText);
    const minors = minorTexts.map((s) => addScrollText(s));
    return { major, minors };
}

export function addNextPillarButton(pageName: keyof typeof pillars) {
    const nextPillarButton = addScrollText(pageName.toUpperCase() + " >");
    nextPillarButton.style.cursor = "pointer";
    nextPillarButton.style.whiteSpace = "nowrap";
    nextPillarButton.onclick = () => site.openPage(pillars[pageName]);
    colorOnHover(nextPillarButton, theme.ieBlue, theme.ieGreen);
    return nextPillarButton;
}

export function getScrollHeight() {
    // return innerHeight * 0.7;
    return 1.02 * innerHeight - 0.000485 * innerHeight * innerHeight;
}

export function getScrollWidth() {
    const SCROLL_WIDTH_PROPORTION = 1;
    return innerWidth * SCROLL_WIDTH_PROPORTION;
}

export function centerWithinScrollY(element: HTMLElement | SVGSVGElement, scale: number) {
    const s = getScrollHeight();
    const height = scale * s;
    element.style.height = px(height);
    element.style.top = px((s - height) / 2);
}

export function centerWithinScrollX(element: HTMLElement | SVGSVGElement, scale: number) {
    const s = getScrollWidth();
    const width = scale * s;
    element.style.width = px(width);
    element.style.left = px((s - width) / 2);
}
