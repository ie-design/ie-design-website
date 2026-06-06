import { body, fadeInAnimation, ieGreen, ieBlue } from "./constants";
import { aligningWithGapsY, isLandscape, px, setSizeX, styleText, TextDetails } from "./layout";
import { appendChildForPage, awaitLayout } from "./page";
import { pillars, site } from "./site";
import { colorOnHover, createElementSVG, fetchSVG } from "./util";

export interface TextSquare {
    major: HTMLElement;
    minors: HTMLElement[];
}

export const scrollContainer = document.createElement("div");
scrollContainer.style.position = "absolute";
body.appendChild(scrollContainer);
(scrollContainer.style as any).scrollbarColor = `${ieGreen} ${ieBlue}55`;

scrollContainer.onwheel = (e) => e.preventDefault();
window.onwheel = (e) => {
    if (scrollContainer.style.overflowY === "scroll") {
        scrollContainer.scrollBy({ top: e.deltaY, left: e.deltaX });
    } else {
        scrollContainer.scrollBy({ left: e.deltaX + e.deltaY });
    }
};

export function resizeScrollContainerLandscape() {
    const scrollHeight = getScrollHeight();

    const scrollLeft = scrollHeight * 0.5;

    const underScrollContainer = (innerHeight - scrollHeight) / 2;
    scrollContainer.style.height = px(scrollHeight + underScrollContainer); // place scroll bar at bottom of page
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
    scrollImage.src = src;
    scrollImage.style.animation = fadeInAnimation();
    scrollImage.style.cursor = "pointer";

    scrollImage.onclick = () => site.openImage(src);

    awaitLayout(scrollImage.decode().catch(() => console.error(`Failed to decode image: ${src}`)));
    appendChildForPage(scrollContainer, scrollImage);
    return scrollImage;
}

export function addScrollSvg(src: string) {
    const scrollSvg = createElementSVG("svg");
    scrollSvg.style.position = "absolute";
    scrollSvg.style.animation = fadeInAnimation();

    async function fetchContent() {
        const fetched = await fetchSVG(src);
        for (const attr of fetched.attributes) scrollSvg.setAttribute(attr.name, attr.value);
        while (fetched.firstChild) scrollSvg.appendChild(fetched.firstChild);

        // const letters = scrollSvg.getElementsByTagName("path");
        // for (const letter of letters) {
        //     letter.style.transition = "fill 0.4s ease-out";
        //     letter.onmouseenter = () => {
        //         const hoverColor = Math.random() > 0.5 ? "hover-blue" : "hover-green";
        //         letter.classList.add(hoverColor);
        //         letter.onmouseleave = () => letter.classList.remove(hoverColor);
        //     };
        // }
    }
    const fetchContentPromise = fetchContent();
    awaitLayout(fetchContentPromise);

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
    if (poster) scrollVideo.poster = poster;
    scrollVideo.style.animation = fadeInAnimation();
    appendChildForPage(scrollContainer, scrollVideo);
    return scrollVideo;
}

export function addScrollText(text: string) {
    const scrollText = document.createElement("p");
    scrollText.innerHTML = text;
    scrollText.style.animation = fadeInAnimation();
    appendChildForPage(scrollContainer, scrollText);
    return scrollText;
}

export function addScrollTextSquare(majorText: string, ...minorTexts: string[]): TextSquare {
    const major = addScrollText(majorText);
    const minors = minorTexts.map(addScrollText);
    return { major, minors };
}

export function addNextPillarButton(pageName: keyof typeof pillars) {
    const nextPillarButton = addScrollText(pageName.toUpperCase() + " →");
    nextPillarButton.style.cursor = "pointer";
    nextPillarButton.style.whiteSpace = "nowrap";
    nextPillarButton.onclick = () => site.openPage(pillars[pageName]);
    colorOnHover(nextPillarButton, ieBlue, ieGreen);
    return nextPillarButton;
}

export function styleNextPillarButton(nextPillarButton: HTMLElement, s: number) {
    styleText(nextPillarButton, { letterSpacing: 0.001 * s, fontWeight: 400, color: ieBlue, fontSize: 0.04 * s, lineHeight: 0.04 * s });
}

export function styleNextPillarButtonMobile(nextPillarButton: HTMLElement, s: number) {
    styleText(nextPillarButton, { letterSpacing: 0.001 * s, fontWeight: 400, color: ieBlue, fontSize: 0.04 * s, lineHeight: 0.04 * s });
}

export function getScrollHeight() {
    // return innerHeight * 0.7;
    return 1.02 * innerHeight - 0.000485 * innerHeight * innerHeight;
}

export function getScrollWidth() {
    const SCROLL_WIDTH_PROPORTION = 1;
    return innerWidth * SCROLL_WIDTH_PROPORTION;
}

export function alignScrollTextSquare({ major, minors }: TextSquare, majorToMinorGap: number, betweenMinorsGap: number) {
    const items: (HTMLElement | number)[] = [];

    items.push(major, majorToMinorGap);

    for (const minor of minors) {
        items.push(minor, betweenMinorsGap);
    }
    items.pop(); // remove final gap, only want betweens

    const scrollHeight = getScrollHeight();
    const [elementAlignments, totalHeight] = aligningWithGapsY(items);
    const groupTop = (scrollHeight - totalHeight) / 2;

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(groupTop + offset);
    }

    for (const minor of minors) {
        minor.style.left = major.style.left;
    }
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
