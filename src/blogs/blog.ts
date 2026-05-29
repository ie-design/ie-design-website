import { aligningWithGapsX, aligningWithGapsY, BoxElement, px, styleText } from "../layout";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollText, addScrollVideo, getScrollHeight, resizeScrollContainerFull } from "../scroll";

export interface BlogContext {
    addSpace: () => void;
    addImageSpace: () => void;

    addImage: (src: string) => void;
    addVideo: (src: string, poster?: string) => void;
    addImagePair: (leftSrc: string, rightSrc: string) => void;
    addHead: (text: string) => void;
    addSubhead: (text: string) => void;
    addParagraph: (text: string) => void;
}

export const addBlog = (blogName: string, withBlogItems: (b: BlogContext) => void) => () => {
    const blogItems: (BoxElement | number)[] = [];

    let queuedGap: number | undefined;

    function withPath(src: string) {
        return `blog/${blogName}/${src}`;
    }

    function buildBlogItem<T extends HTMLElement, TArgs extends unknown[]>(builder: (...args: TArgs) => T, followingGap: number) {
        const group: T[] = [];
        return [
            (...args: TArgs) => {
                const element = builder(...args);
                group.push(element);

                if (queuedGap && element instanceof HTMLParagraphElement) {
                    blogItems.push(queuedGap);
                }
                blogItems.push(element);
                queuedGap = followingGap;
            },
            group,
        ] as const;
    }

    const IMAGE_SPACING = 0.02;
    const addSpace = () => blogItems.push(0.03);
    const addImageSpace = () => blogItems.push(IMAGE_SPACING);

    const [addImage, _i] = buildBlogItem((src: string) => addScrollImage(withPath(src)), 0);
    const [addVideo, _v] = buildBlogItem((src: string, poster?: string) => addScrollVideo(withPath(src), poster && withPath(poster)), 0.018);
    const [addHead, heads] = buildBlogItem((text: string) => addScrollText(text), 0.018);
    const [addSubhead, subheads] = buildBlogItem((text: string) => addScrollText(text), 0.015);
    const [addParagraph, paragraphs] = buildBlogItem((text: string) => addScrollText(text), 0.018);

    const imagePairRights: HTMLImageElement[] = [];
    const [addImagePair, imagePairLefts] = buildBlogItem((leftSrc: string, rightSrc: string) => {
        const left = addScrollImage(withPath(leftSrc));
        const right = addScrollImage(withPath(rightSrc));
        imagePairRights.push(right);
        return left;
    }, 0);

    withBlogItems({ addSpace, addImageSpace, addImage, addVideo, addImagePair, addHead, addSubhead, addParagraph });

    registerUpdateLayout(() => {
        resizeScrollContainerFull();

        const s = innerWidth;

        const scrollHeight = getScrollHeight();
        const scrollLeft = scrollHeight * 0.3;
        const fit = innerWidth - scrollLeft * 2;
        const leftMargin = (innerWidth - fit) / 2;

        for (const head of heads) {
            styleText(head, { letterSpacing: 0.0002 * s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.025 * s, width: 1 * s, lineHeight: 0.02 * s });
        }
        for (const subhead of subheads) {
            styleText(subhead, { letterSpacing: 0.0002 * s, fontWeight: 600, color: "#000000", fontSize: 0.011 * s, width: 1 * s, lineHeight: 0.02 * s });
        }
        for (const paragraph of paragraphs) {
            styleText(paragraph, { letterSpacing: 0.0002 * s, fontWeight: 350, color: "#000000", fontSize: 0.011 * s, width: 1 * s, lineHeight: 0.019 * s });
        }

        const imageWidth = (fit - IMAGE_SPACING * s) / 2;
        for (let i = 0; i < imagePairLefts.length; i++) {
            imagePairLefts[i].style.width = px(imageWidth);
            imagePairRights[i].style.width = px(imageWidth);
        }

        for (const t of blogItems) {
            if (t instanceof HTMLElement) {
                t.style.width = px(fit);
            }
        }

        // pair lefts are in blogItems so get overwritten above — restore imageWidth
        for (const left of imagePairLefts) left.style.width = px(imageWidth);

        const q = blogItems.map((b) => (b instanceof Element ? b : b * s));
        const [elementAlignments, _] = aligningWithGapsY(q);
        for (const { element, offset } of elementAlignments) {
            element.style.top = px(offset);
            element.style.left = px(leftMargin);
        }

        for (let i = 0; i < imagePairLefts.length; i++) {
            const left = imagePairLefts[i];
            const right = imagePairRights[i];
            right.style.top = left.style.top;
            const [alignments] = aligningWithGapsX([left, IMAGE_SPACING * s, right]);
            for (const { element, offset } of alignments) {
                element.style.left = px(leftMargin + offset);
            }
        }
    });
};
