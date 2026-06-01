import { Blog } from "../blogs/blog";
import { blogs } from "../blogs/blogs";

import { ieBlue } from "../constants";
import { aligningWithGapsX, aligningWithGapsY, posX, posY, px, sizeX, sizeY, styleText } from "../layout";
import { cleanLastPage, registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollText, centerWithinScrollY, getScrollHeight, resizeScrollContainerLandscape } from "../scroll";
import { site } from "../site";
import { interlaced } from "../util";

const INSPIRATION_TILE_WIDTH_PROPORTION = 0.85;

interface InspirationTile {
    image: HTMLImageElement;
    major: HTMLElement;
    minor: HTMLElement;
    readMore: HTMLElement;
}

function styleInspirationTile({ image, major, minor, readMore }: InspirationTile) {
    const s = getScrollHeight();

    styleText(major, { letterSpacing: 0.001 * s, fontWeight: 400, color: "#000000", fontSize: 0.036 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.09 * s });
    styleText(minor, { letterSpacing: 0.0005 * s, fontWeight: 350, color: "#000000", fontSize: 0.027 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.05 * s });
    styleText(readMore, { letterSpacing: 0.001 * s, fontWeight: 400, color: ieBlue, fontSize: 0.03 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.05 * s });

    image.style.height = px(0.55 * s);
}

function alignInspirationTile({ image, major, minor, readMore }: InspirationTile) {
    const s = getScrollHeight();

    major.style.left = image.style.left;
    minor.style.left = image.style.left;
    readMore.style.left = image.style.left;

    const [elementAlignments, _] = aligningWithGapsY([
        image, // -
        0.03 * s,
        major,
        -0.01 * s,
        minor,
        0.01 * s,
        readMore,
    ]);

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(offset + 0.15 * s);
    }
}

function addInspirationTile(blog: Blog): InspirationTile {
    const image = addScrollImage(blog.thumbnailPath());
    const major = addScrollText(blog.title);
    const minor = addScrollText(blog.subtitle);
    const readMore = addScrollText("Read more");

    readMore.style.cursor = "pointer";
    function goToBlog() {
        site.openPage(blog.add);
    }
    readMore.onclick = goToBlog;
    image.onclick = goToBlog;

    return { image, major, minor, readMore };
}

export function addInspirationPage() {
    const inspiration = addScrollSvg("inspiration/inspiration.svg");
    const andOtherThings = addScrollSvg("inspiration/and-other-things.svg");

    const tiles = blogs.map(addInspirationTile);

    const scrollPadding = addScrollPadding();

    registerUpdateLayout(() => {
        resizeScrollContainerLandscape();
        const s = getScrollHeight();

        centerWithinScrollY(inspiration, 0.75);
        andOtherThings.style.height = px(0.06 * s);

        for (const tile of tiles) styleInspirationTile(tile);

        const tileImagesWithGaps = interlaced(
            tiles.map((t) => t.image),
            0.1 * s
        );
        const [elementAlignments, _] = aligningWithGapsX([inspiration, 0.25 * s, ...tileImagesWithGaps]);

        for (const { element, offset } of elementAlignments) {
            element.style.left = px(offset);
        }

        andOtherThings.style.left = px(posX(inspiration));
        andOtherThings.style.top = px(posY(inspiration) + sizeY(inspiration) + 0.06 * s);

        for (const tile of tiles) alignInspirationTile(tile);

        const lastImage = tiles[tiles.length - 1].image;
        scrollPadding.style.left = px(posX(lastImage) + sizeX(lastImage) + 0.1 * s);
    });
}
