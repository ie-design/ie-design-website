import { Blog } from "../blogs/blog";
import { blogs } from "../blogs/blogs";
import { footer, LANDING_SVG_SCALE, startGapDesktop, startGapMobile } from "../components";
import { isLandscape, styleMultiLineText, styleSingleLineText } from "../layout";
import { Align, Axis, el, flow, gap, imageWithFillWidth, imageWithWidth, LayoutNode, run, setSizeX, setSizeY } from "../newLayoutEngine";
import { registerUpdateLayout } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollText, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait } from "../scroll";
import { contentWidthMobile, site } from "../site";
import { theme } from "../theme";
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
    colorOnHover(readMore, theme.ieBlue, theme.ieGreen);
    function goToBlog() {
        site.openPage(blog.add);
    }
    readMore.onclick = goToBlog;
    image.onclick = goToBlog;

    image.style.transition = "opacity 0.5s ease";
    image.addEventListener("pointerenter", () => (image.style.opacity = "0.6"));
    image.addEventListener("pointerleave", () => (image.style.opacity = ""));

    return { image, title, description, readMore };
}

function tileDesktop({ image, title, description, readMore }: InspirationTile): LayoutNode {
    return flow(
        Axis.Y,
        [
            imageWithFillWidth(image), // -
            gap(0.05),
            el(title, { style: (c) => styleSingleLineText(title, { letterSpacing: 0, fontWeight: 400, color: theme.bodyText, fontSize: 0.036 * c.s }) }),
            gap(0.01),
            el(description, {
                style: (c) => {
                    styleMultiLineText(description, { letterSpacing: 0.0005 * c.s, fontWeight: 300, color: theme.bodyText, fontSize: 0.027 * c.s, lineHeight: 0.05 * c.s });
                    setSizeX(description, c.parent.w);
                },
            }),
            gap(0.01),
            el(readMore, { style: (c) => styleSingleLineText(readMore, { letterSpacing: 0, fontWeight: 400, color: theme.ieBlue, fontSize: 0.03 * c.s }) }),
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
                    el(title, { style: (c) => styleSingleLineText(title, { letterSpacing: 0, fontWeight: 400, color: theme.bodyText, fontSize: 0.04 * c.s }) }),
                    gap(0.02),
                    el(description, {
                        style: (c) => {
                            styleMultiLineText(description, { letterSpacing: 0.0005 * c.s, fontWeight: 300, color: theme.bodyText, fontSize: 0.03 * c.s, lineHeight: 0.05 * c.s });
                            setSizeX(description, c.parent.w);
                        },
                    }),
                    gap(0.02),
                    el(readMore, { style: (c) => styleSingleLineText(readMore, { letterSpacing: 0, fontWeight: 400, color: theme.ieBlue, fontSize: 0.032 * c.s }) }),
                ],
                { w: () => contentWidthMobile(), align: Align.Center }
            ),
        ],
        { w: (c) => c.s }
    );
}

export function addInspirationPage() {
    const inspiration = addScrollSvg("inspiration/inspiration.svg");
    const andOtherThings = addScrollSvg("inspiration/and-other-things.svg");

    const tiles = blogs.toReversed().map(addInspirationTile);

    const nextPillarButton = addNextPillarButton("evolution");
    const scrollPadding = addScrollPadding();

    const desktopLayout = flow(
        Axis.X,
        [
            startGapDesktop(),
            flow(
                Axis.Y,
                [
                    el(inspiration, { style: (c) => setSizeY(inspiration, LANDING_SVG_SCALE * c.s) }), // -
                    gap(0.06),
                    el(andOtherThings, { style: (c) => setSizeY(andOtherThings, 0.06 * c.s) }),
                ],
                { align: Align.Center }
            ),
            gap(0.25),
            ...interlaceWithBetween(tiles.map(tileDesktop), gap(0.1)),
            ...footer(nextPillarButton, scrollPadding),
        ],
        { h: (c) => c.s }
    );

    const mobileLayout = flow(
        Axis.Y,
        [
            startGapMobile(),
            imageWithWidth(inspiration, 0.9), // -
            gap(0.05),
            imageWithWidth(andOtherThings, 0.9),
            gap(0.1),
            ...interlaceWithBetween(tiles.map(tileMobile), gap(0.12)),
            ...footer(nextPillarButton, scrollPadding),
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
