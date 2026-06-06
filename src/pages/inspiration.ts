import { Blog } from "../blogs/blog";
import { blogs } from "../blogs/blogs";
import { ieBlue, ieGreen } from "../constants";
import { isLandscape, NEXT_PILLAR_BUTTON_PAD, styleMultiLineText, styleSingleLineText } from "../layout";
import { Align, Axis, el, flow, gap, imageWithFillWidth, imageWithWidth, LayoutNode, run, setSizeX, setSizeY } from "../newLayoutEngine";
import { registerUpdateLayout } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollText, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, styleNextPillarButton, styleNextPillarButtonMobile } from "../scroll";
import { site } from "../site";
import { colorOnHover, interlaceWithBetween } from "../util";

interface InspirationTile {
    image: HTMLImageElement;
    title: HTMLElement;
    description: HTMLElement;
    readMore: HTMLElement;
}

function addInspirationTile(blog: Blog) {
    const image = addScrollImage(blog.thumbnailPath());
    const title = addScrollText(blog.title);
    const description = addScrollText(blog.description);
    const readMore = addScrollText("Read more");

    readMore.style.cursor = "pointer";
    colorOnHover(readMore, ieBlue, ieGreen);
    function goToBlog() {
        site.openPage(blog.add);
    }
    readMore.onclick = goToBlog;
    image.onclick = goToBlog;

    return { image, title, description, readMore };
}

function tileDesktop({ image, title, description, readMore }: InspirationTile): LayoutNode {
    return flow(
        Axis.Y,
        [
            imageWithFillWidth(image), // -
            gap(0.03),
            el(title, { style: (c) => styleSingleLineText(title, { letterSpacing: 0, fontWeight: 400, color: "#000000", fontSize: 0.036 * c.s }) }),
            gap(0.01),
            el(description, {
                style: (c) => {
                    styleMultiLineText(description, { letterSpacing: 0.0005 * c.s, fontWeight: 300, color: "#000000", fontSize: 0.027 * c.s, lineHeight: 0.05 * c.s });
                    setSizeX(description, c.parent.w);
                },
            }),
            gap(0.01),
            el(readMore, { style: (c) => styleSingleLineText(readMore, { letterSpacing: 0, fontWeight: 400, color: ieBlue, fontSize: 0.03 * c.s }) }),
        ],
        { w: (c) => 0.8 * c.s, place: (self, s) => (self.y = 0.15 * s) }
    );
}

function tileMobile({ image, title, description, readMore }: InspirationTile): LayoutNode {
    return flow(
        Axis.Y,
        [
            imageWithFillWidth(image), // -
            gap(0.07),
            flow(
                Axis.Y,
                [
                    el(title, { style: (c) => styleSingleLineText(title, { letterSpacing: 0, fontWeight: 400, color: "#000000", fontSize: 0.04 * c.s }) }),
                    gap(0.02),
                    el(description, {
                        style: (c) => {
                            styleMultiLineText(description, { letterSpacing: 0.0005 * c.s, fontWeight: 300, color: "#000000", fontSize: 0.03 * c.s, lineHeight: 0.05 * c.s });
                            setSizeX(description, c.parent.w);
                        },
                    }),
                    gap(0.02),
                    el(readMore, { style: (c) => styleSingleLineText(readMore, { letterSpacing: 0, fontWeight: 400, color: ieBlue, fontSize: 0.032 * c.s }) }),
                ],
                { w: (c) => c.s * 0.85, align: Align.Center }
            ),
        ],
        { w: (c) => c.s }
    );
}

export function addInspirationPage() {
    const inspiration = addScrollSvg("inspiration/inspiration.svg");
    const andOtherThings = addScrollSvg("inspiration/and-other-things.svg");

    const tiles = blogs.toReversed().map(addInspirationTile);

    const nextPillarButton = addNextPillarButton("connect");
    const scrollPadding = addScrollPadding();

    const desktopLayout = flow(
        Axis.X,
        [
            flow(
                Axis.Y,
                [
                    el(inspiration, { style: (c) => setSizeY(inspiration, 0.75 * c.s) }), // -
                    gap(0.06),
                    el(andOtherThings, { style: (c) => setSizeY(andOtherThings, 0.06 * c.s) }),
                ],
                { align: Align.Center }
            ),
            gap(0.25),
            ...interlaceWithBetween(tiles.map(tileDesktop), gap(0.1)),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(nextPillarButton, { style: (c) => styleNextPillarButton(nextPillarButton, c.s), align: Align.Center }),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(scrollPadding),
        ],
        { h: (c) => c.s }
    );

    const mobileLayout = flow(
        Axis.Y,
        [
            gap(0.1),
            imageWithWidth(inspiration, 0.9),
            gap(0.05),
            imageWithWidth(andOtherThings, 0.9),
            gap(0.1),
            ...interlaceWithBetween(tiles.map(tileMobile), gap(0.12)),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(nextPillarButton, {
                style: (c) => {
                    styleNextPillarButtonMobile(nextPillarButton, c.s);
                    setSizeX(nextPillarButton, 0.2 * c.s);
                },
                align: Align.Center,
            }),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(scrollPadding),
        ],
        { w: (c) => c.s }
    );

    registerUpdateLayout(() => {
        if (isLandscape()) {
            resizeScrollContainerLandscape();
            run(desktopLayout, getScrollHeight());
        } else {
            resizeScrollContainerPortrait();
            run(mobileLayout, getScrollWidth());
        }
    });
}
