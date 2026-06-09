import { isLandscape, styleMultiLineText } from "../layout";
import { Align, Axis, el, flow, gap, imageWithParentWidth, imageWithWidth, LayoutNode, run, setSizeX } from "../newLayoutEngine";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollText, addScrollVideo, resizeScrollContainerFull } from "../scroll";
import { site } from "../site";
import { theme } from "../theme";
import { colorOnHover } from "../util";

const IMAGE_PAIR_SPACING = 0.02;
const DEFAULT_DESKTOP_SPACING = 0.018;
const DEFAULT_MOBILE_SPACING = 0.045;
const thumbnail = "thumbnail.jpg";

const desktopFlow = (...children: LayoutNode[]) => flow(Axis.Y, children, { w: (c) => c.s * 0.7, align: Align.Center });
const mobileFlow = (...children: LayoutNode[]) => flow(Axis.Y, children, { w: (c) => c.s * 0.85, align: Align.Center });

export class Blog {
    name = "";
    nameWithNumber = "";
    prevBlog?: Blog;
    nextBlog?: Blog;

    constructor(readonly title: string, readonly description: string, private readonly setup: (b: Blog) => void) {}

    private desktopNodes: LayoutNode[] = [];
    private mobileNodes: LayoutNode[] = [];

    path = (src: string) => `blog/${this.nameWithNumber}/${src}`;
    thumbnailPath = () => this.path(thumbnail);

    addSpace = () => {
        this.desktopNodes.push(gap(0.04));
        this.mobileNodes.push(gap(0.08));
    };
    addImagePairSpace = () => {
        this.desktopNodes.push(gap(IMAGE_PAIR_SPACING));
        this.mobileNodes.push(gap(IMAGE_PAIR_SPACING));
    };

    addImage = (src: string, scale = 1) => {
        const img = addScrollImage(this.path(src));
        this.desktopNodes.push(desktopFlow(imageWithParentWidth(img, scale)));
        this.mobileNodes.push(imageWithParentWidth(img, scale));
        return img;
    };

    addImagePair = (leftSrc: string, rightSrc: string): [HTMLImageElement, HTMLImageElement] => {
        const leftImage = addScrollImage(this.path(leftSrc));
        const rightImage = addScrollImage(this.path(rightSrc));
        this.desktopNodes.push(
            desktopFlow(
                flow(Axis.X, [imageWithParentWidth(leftImage, (1 - IMAGE_PAIR_SPACING) / 2), gap(IMAGE_PAIR_SPACING), imageWithParentWidth(rightImage, (1 - IMAGE_PAIR_SPACING) / 2)], { w: (c) => c.parent.w }) // -
            )
        );
        this.mobileNodes.push(
            mobileFlow(
                flow(Axis.X, [imageWithParentWidth(leftImage, (1 - IMAGE_PAIR_SPACING) / 2), gap(IMAGE_PAIR_SPACING), imageWithParentWidth(rightImage, (1 - IMAGE_PAIR_SPACING) / 2)], { w: (c) => c.parent.w }) // -
            )
        );
        return [leftImage, rightImage];
    };

    addVideo = (src: string, poster?: string) => {
        const video = addScrollVideo(this.path(src), poster ? this.path(poster) : undefined);
        this.desktopNodes.push(
            desktopFlow(
                el(video, { style: (c) => setSizeX(video, c.parent.w) }), // -
                gap(DEFAULT_DESKTOP_SPACING)
            )
        );
        this.mobileNodes.push(
            mobileFlow(
                el(video, { style: (c) => setSizeX(video, c.parent.w) }), // -
                gap(DEFAULT_MOBILE_SPACING)
            )
        );
        return video;
    };

    addHead = (text: string) => {
        const elem = addScrollText(text);
        this.desktopNodes.push(
            desktopFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0, fontWeight: 400, color: theme.neutralFront, fontSize: 0.025 * c.s, lineHeight: 0.02 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(DEFAULT_DESKTOP_SPACING)
            )
        );
        this.mobileNodes.push(
            mobileFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0.005 * c.s, fontWeight: 400, color: theme.neutralFront, fontSize: 0.06 * c.s, lineHeight: 0.08 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(DEFAULT_MOBILE_SPACING)
            )
        );
        return elem;
    };

    addSubhead = (text: string) => {
        const elem = addScrollText(text);
        this.desktopNodes.push(
            desktopFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0, fontWeight: 600, color: theme.bodyText, fontSize: 0.011 * c.s, lineHeight: 0.02 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(0.015)
            )
        );
        this.mobileNodes.push(
            mobileFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0, fontWeight: 600, color: theme.bodyText, fontSize: 0.03 * c.s, lineHeight: 0.055 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(0.015)
            )
        );
        return elem;
    };

    addParagraph = (text: string) => {
        const elem = addScrollText(text);
        this.desktopNodes.push(
            desktopFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0, fontWeight: 300, color: theme.bodyText, fontSize: 0.011 * c.s, lineHeight: 0.02 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(DEFAULT_DESKTOP_SPACING)
            )
        );
        this.mobileNodes.push(
            mobileFlow(
                el(elem, {
                    style: (c) => {
                        styleMultiLineText(elem, { letterSpacing: 0, fontWeight: 300, color: theme.bodyText, fontSize: 0.03 * c.s, lineHeight: 0.055 * c.s });
                        setSizeX(elem, c.parent.w);
                    },
                }),
                gap(DEFAULT_MOBILE_SPACING)
            )
        );
        return elem;
    };

    add = () => {
        this.desktopNodes = [];
        this.mobileNodes = [];

        this.addImage(thumbnail);
        this.addSpace();
        this.addHead(this.title);

        this.setup(this);

        function addNavButton(navBlog: Blog | undefined, label: (blog: Blog) => string) {
            if (navBlog) {
                const btn = addScrollText(label(navBlog));
                btn.style.cursor = "pointer";
                colorOnHover(btn, theme.ieBlue, theme.ieGreen);
                btn.onclick = () => site.openPage(navBlog.add);
                return btn;
            }
        }
        const prevButton = addNavButton(this.prevBlog, (b) => "← " + b.title);
        const nextButton = addNavButton(this.nextBlog, (b) => b.title + " →");

        const scrollPadding = addScrollPadding();

        function navButtonNodeDesktop(btn: HTMLParagraphElement | undefined, alignAlongFlow: Align) {
            return btn ? el(btn, { style: (c) => styleMultiLineText(btn, { letterSpacing: 0, fontWeight: 500, color: theme.ieBlue, fontSize: 0.011 * c.s, lineHeight: 0.02 * c.s }), alignAlongFlow }) : undefined;
        }
        const desktopLayout = flow(
            Axis.Y,
            [
                ...this.desktopNodes, // -
                gap(0.06),
                desktopFlow(
                    flow(
                        Axis.X,
                        [navButtonNodeDesktop(prevButton, Align.Start), navButtonNodeDesktop(nextButton, Align.End)].filter((x) => x !== undefined),
                        { w: (c) => c.parent.w }
                    )
                ),
                gap(0.05),
                el(scrollPadding),
            ],
            { w: (c) => c.s }
        );

        function navButtonNodeMobile(btn: HTMLParagraphElement | undefined, alignAlongFlow: Align) {
            return btn ? el(btn, { style: (c) => styleMultiLineText(btn, { letterSpacing: 0, fontWeight: 500, color: theme.ieBlue, fontSize: 0.02 * c.s, lineHeight: 0.06 * c.s }), alignAlongFlow }) : undefined;
        }
        const mobileLayout = flow(
            Axis.Y,
            [
                ...this.mobileNodes,
                gap(0.06),
                mobileFlow(
                    flow(
                        Axis.X,
                        [navButtonNodeMobile(prevButton, Align.Start), navButtonNodeMobile(nextButton, Align.End)].filter((x) => x !== undefined),
                        { w: (c) => c.parent.w }
                    )
                ),
                gap(0.05),
                el(scrollPadding),
            ],
            { w: (c) => c.s }
        );

        registerUpdateLayout(() => {
            if (isLandscape()) {
                resizeScrollContainerFull();
                run(desktopLayout, innerWidth);
            } else {
                resizeScrollContainerFull();
                run(mobileLayout, innerWidth);
            }
        });
    };
}

export function initializeBlogs(blogs: Blog[]) {
    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        blog.name = blog.title // -
            .toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll(".", "");
        blog.nameWithNumber = String(i + 1).padStart(2, "0") + "-" + blog.name;
    }

    for (let i = 0; i < blogs.length; i++) {
        blogs[i].prevBlog = blogs[i - 1];
        blogs[i].nextBlog = blogs[i + 1];
    }

    return blogs;
}
