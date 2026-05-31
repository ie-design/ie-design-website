import { newStudioNewViewBlog } from "../blogs/01-new-studio-new-view";
import { reconnectingBlog } from "../blogs/02-reconnecting";
import { theViewFromInsideBlog } from "../blogs/03-the-view-from-inside";
import { inspired2CreateBlog } from "../blogs/04-inspired-2-create";
import { brandingFromTheNameUpBlog } from "../blogs/05-branding-from-the-name-up";
import { rebrandingAFamilyBusinessBlog } from "../blogs/06-rebranding-a-family-business";
import { remixBlog } from "../blogs/07-remix";
import { gottaLoveACookIeBlog } from "../blogs/08-gotta-love-a-cook-ie";
import { shareSomeDesignLoveBlog } from "../blogs/09-share-some-design-love";
import { theStartOfSomethingYumIeBlog } from "../blogs/10-the-start-of-something-yum-ie";
import { growingTheDreamBlog } from "../blogs/11-growing-the-dream";
import { Blog } from "../blogs/blog";
import { blogs } from "../blogs/blogs";

import { ieBlue } from "../constants";
import { setNavHidden } from "../nav";
import { aligningWithGapsX, aligningWithGapsY, posX, px, sizeX, styleText } from "../layout";
import { cleanLastPage, registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollText, centerWithinScrollY, getScrollHeight, resizeScrollContainerLandscape } from "../scroll";
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
    const image = addScrollImage(blog.tileImage());
    const major = addScrollText(blog.title);
    const minor = addScrollText(blog.subtitle);
    const readMore = addScrollText("Read more");

    readMore.style.cursor = "pointer";
    readMore.onclick = () => {
        cleanLastPage();
        history.pushState({}, "", "/blog/" + blog.slug);
        setNavHidden(true);
        blog.add();
    };

    return { image, major, minor, readMore };
}

export function addInspirationPage() {
    const inspiration = addScrollSvg("inspiration/inspiration.svg");

    const tiles = blogs.map(addInspirationTile);

    const scrollPadding = addScrollPadding();

    registerUpdateLayout(() => {
        resizeScrollContainerLandscape();
        const s = getScrollHeight();

        centerWithinScrollY(inspiration, 0.75);

        for (const tile of tiles) styleInspirationTile(tile);

        const tileImagesWithGaps = interlaced(
            tiles.map((t) => t.image),
            0.1 * s
        );
        const [elementAlignments, _] = aligningWithGapsX([inspiration, 0.25 * s, ...tileImagesWithGaps]);

        for (const { element, offset } of elementAlignments) {
            element.style.left = px(offset);
        }

        for (const tile of tiles) alignInspirationTile(tile);

        const lastImage = tiles[tiles.length - 1].image;
        scrollPadding.style.left = px(posX(lastImage) + sizeX(lastImage) + 0.1 * s);
    });
}
