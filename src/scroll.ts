import { body, fadeInAnimation, gray, ieBlue, ieGreen } from "./constants";
import { aligningWithGapsY, centerElementX, centerElementY, isLandscape, px, setImageHeight, setImageWidth, styleText, TextDetails } from "./layout";
import { Modal } from "./modal";
import { appendChildForPage, awaitLayout, registerUpdateLayout } from "./page";
import { createElementSVG, createIconSVG, fetchSVG, makeLine, makePolyline, setAttributes } from "./util";

export interface TextSquare {
    major: HTMLElement;
    minors: HTMLElement[];
}

export const scrollContainer = document.createElement("div");
scrollContainer.style.position = "absolute";
body.appendChild(scrollContainer);
(scrollContainer.style as any).scrollbarColor = `${ieGreen} ${ieBlue}55`;

scrollContainer.onwheel = (e) => {
    if (isLandscape() && !e.shiftKey) scrollContainer.scrollBy({ left: e.deltaY });
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

    scrollImage.onclick = () => {
        if (Modal.isAnyModalOpen) return;

        const bigImage = document.createElement("img");
        bigImage.src = src;
        bigImage.style.position = "absolute";
        bigImage.style.filter = `drop-shadow(0px 0px 15px ${ieBlue})`;

        const sz = 60;
        const exitButton = createIconSVG(sz);
        const makeExitButtonLine = makeLine(exitButton, 12);
        const exitButtonLine1 = makeExitButtonLine();
        const exitButtonLine2 = makeExitButtonLine();
        setAttributes(exitButtonLine1, { x1: 0, y1: 0, x2: sz, y2: sz });
        setAttributes(exitButtonLine2, { x1: 0, y1: sz, x2: sz, y2: 0 });
        exitButton.style.stroke = gray;

        const fullscreenButton = createIconSVG(sz);
        const makeFullscreenButtonPolyline = makePolyline(fullscreenButton, 12);
        const fullscreenButtonPolyline1 = makeFullscreenButtonPolyline();

        function toPolyline(list: number[][]) {
            return list.map((point) => point.join(",")).join(" ");
        }

        setAttributes(fullscreenButtonPolyline1, {
            points: toPolyline([
                [0, 0],
                [0, sz],
                [sz, sz],
            ]),
        });
        fullscreenButton.style.stroke = gray;

        const imageModal = new Modal(
            "#ffffffee",
            (backdrop) => {
                backdrop.appendChild(bigImage);
                backdrop.appendChild(exitButton);
                backdrop.appendChild(fullscreenButton);
            },
            (time) => {
                bigImage.style.opacity = time + "";
            },
            () => {}
        );
        imageModal.beginOpen();
        exitButton.onclick = imageModal.beginClose;
        fullscreenButton.onclick = () => bigImage.requestFullscreen();

        registerUpdateLayout(() => {
            const size = 15;
            const fromEdge = 15;

            exitButton.style.width = px(size);
            exitButton.style.height = px(size);
            exitButton.style.left = px(innerWidth - size - fromEdge);
            exitButton.style.top = px(fromEdge);

            fullscreenButton.style.width = px(size);
            fullscreenButton.style.height = px(size);
            fullscreenButton.style.left = px(innerWidth - size - fromEdge - size * 2);
            fullscreenButton.style.top = px(fromEdge);

            const height = innerHeight * 0.9;
            setImageHeight(bigImage, height);
            const minWidth = innerWidth * 0.9;
            if (bigImage.offsetWidth > minWidth) {
                setImageWidth(bigImage, minWidth);
            }
            centerElementX(bigImage);
            centerElementY(bigImage);
        });
    };

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

    appendChildForPage(scrollContainer, scrollSvg)
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

export function styleScrollTextSquare({ major, minors }: TextSquare, majorTextDetails: TextDetails, minorTextDetails: TextDetails) {
    styleText(major, majorTextDetails);
    for (const minor of minors) styleText(minor, minorTextDetails);
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
