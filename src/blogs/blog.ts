import { aligningWithGapsY, BoxElement, px, styleText } from "../layout";
import { ieBlue, ieGreen } from "../constants";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollText, addScrollVideo, getScrollHeight, resizeScrollContainerFull } from "../scroll";

const IMAGE_SPACING = 0.02;
const DEFAULT_SPACING = 0.018;

export class Blog {
    constructor(readonly name: string, readonly title: string, readonly subtitle: string, private readonly setup: (b: Blog) => void) {}

    get tileImage() {
        return `blog/${this.name}/thumbnail.jpg`;
    }

    items: (BoxElement | number)[] = [];

    private path = (src: string) => `blog/${this.name}/${src}`;

    gap = 0;
    push = <T extends HTMLElement>(element: T, followingGap: number): T => {
        if (this.gap && element instanceof HTMLParagraphElement) this.items.push(this.gap);
        this.items.push(element);
        this.gap = followingGap;
        return element;
    };

    addSpace = () => {
        this.items.push(0.04);
    };
    addImageSpace = () => {
        this.items.push(IMAGE_SPACING);
    };

    imagesAndScales = new Map<HTMLImageElement, number>();
    addImage = (src: string, scale?: number) => {
        const img = addScrollImage(this.path(src));
        this.imagesAndScales.set(img, scale ?? 1);
        return this.push(img, 0);
    };

    imagePairs: [HTMLImageElement, HTMLImageElement][] = [];
    addImagePair = (leftSrc: string, rightSrc: string): [HTMLImageElement, HTMLImageElement] => {
        const leftImage = addScrollImage(this.path(leftSrc));
        const rightImage = addScrollImage(this.path(rightSrc));
        this.imagePairs.push([leftImage, rightImage]);
        this.push(leftImage, 0);
        return [leftImage, rightImage];
    };

    videos: HTMLVideoElement[] = [];
    addVideo = (src: string, poster?: string) => {
        const video = addScrollVideo(this.path(src), poster ? this.path(poster) : undefined);
        this.videos.push(video);
        return this.push(video, DEFAULT_SPACING);
    };

    heads: HTMLParagraphElement[] = [];
    addHead = (text: string) => {
        const el = addScrollText(text);
        this.heads.push(el);
        return this.push(el, DEFAULT_SPACING);
    };

    subheads: HTMLParagraphElement[] = [];
    addSubhead = (text: string) => {
        const el = addScrollText(text);
        this.subheads.push(el);
        return this.push(el, 0.015);
    };

    paragraphs: HTMLParagraphElement[] = [];
    addParagraph = (text: string) => {
        const el = addScrollText(text);
        this.paragraphs.push(el);
        return this.push(el, DEFAULT_SPACING);
    };

    link = (text: string, href: string) => {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.innerText = text;
        a.style.color = ieBlue;
        a.style.textDecoration = "none";
        a.onmouseenter = () => (a.style.color = ieGreen);
        a.onmouseleave = () => (a.style.color = ieBlue);
        return a;
    };

    add = () => {
        this.items = [];
        this.gap = 0;
        this.imagesAndScales = new Map();
        this.imagePairs = [];
        this.videos = [];
        this.heads = [];
        this.subheads = [];
        this.paragraphs = [];

        this.addImage("thumbnail.jpg");
        this.addSpace();
        this.addHead(this.title);
        this.setup(this);

        registerUpdateLayout(() => {
            resizeScrollContainerFull();

            const s = innerWidth;
            const h = getScrollHeight();
            const leftMargin = h * 0.3;
            const fit = innerWidth - leftMargin * 2;

            for (const [image, scale] of this.imagesAndScales) {
                const scaledWidth = fit * scale;
                image.style.width = px(scaledWidth);
            }

            const halfImageWidth = (fit - IMAGE_SPACING * s) / 2;
            for (const [leftImage, rightImage] of this.imagePairs) {
                leftImage.style.width = px(halfImageWidth);
                rightImage.style.width = px(halfImageWidth);
            }

            for (const video of this.videos) video.style.width = px(fit);

            for (const head of this.heads) styleText(head, { letterSpacing: 0.0002 * s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.025 * s, width: fit, lineHeight: 0.02 * s });
            for (const subhead of this.subheads) styleText(subhead, { letterSpacing: 0.0002 * s, fontWeight: 600, color: "#000000", fontSize: 0.011 * s, width: fit, lineHeight: 0.02 * s });
            for (const paragraph of this.paragraphs) styleText(paragraph, { letterSpacing: 0.0002 * s, fontWeight: 350, color: "#000000", fontSize: 0.011 * s, width: fit, lineHeight: 0.019 * s });

            const itemsScaled = this.items.map((item) => (item instanceof Element ? item : item * s));
            const [elementAlignments, _] = aligningWithGapsY(itemsScaled);
            for (const { element, offset } of elementAlignments) {
                element.style.top = px(offset);
                element.style.left = px(leftMargin);
            }

            for (const [image, scale] of this.imagesAndScales) {
                const scaledWidth = fit * scale;
                image.style.left = px(leftMargin + (fit - scaledWidth) / 2);
            }

            for (const [leftImage, rightImage] of this.imagePairs) {
                rightImage.style.top = leftImage.style.top;
                rightImage.style.left = px(leftMargin + halfImageWidth + IMAGE_SPACING * s);
            }
        });
    };
}
