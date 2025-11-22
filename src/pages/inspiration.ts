import { ieBlue } from "../constants";
import { aligningWithGapsX, aligningWithGapsY, posX, px, sizeX, styleText } from "../layout";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollText, centerWithinScrollY, getScrollHeight } from "../scroll";
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

    styleText(major, { letterSpacing: 0.6, fontWeight: 400, color: "#000000", fontSize: 0.036 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.09 * s });
    styleText(minor, { letterSpacing: 0.3, fontWeight: 350, color: "#000000", fontSize: 0.027 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.05 * s });
    styleText(readMore, { letterSpacing: 0.5, fontWeight: 400, color: ieBlue, fontSize: 0.03 * s, width: INSPIRATION_TILE_WIDTH_PROPORTION * s, lineHeight: 0.05 * s });

    image.style.height = px(0.55 * s);
}

function alignInspirationTile({ image, major, minor, readMore }: InspirationTile) {
    const s = getScrollHeight();

    major.style.left = image.style.left;
    minor.style.left = image.style.left;
    readMore.style.left = image.style.left;

    const [elementAlignments, _] = aligningWithGapsY([
        image, //
        0.03 * s,
        major,
        -0.01 * s,
        minor,
        0.01 * s,
        readMore,
    ]);

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(offset + s * 0.15);
    }
}

function addInspirationTile(imageString: string, majorText: string, minorText: string): InspirationTile {
    const image = addScrollImage(imageString);
    const major = addScrollText(majorText);
    const minor = addScrollText(minorText);
    const readMore = addScrollText("Read more");

    return { image, major, minor, readMore };
}

export function addInspirationPage() {
    const inspiration = addScrollSvg("inspiration/inspiration.svg");

    const tiles = [
        addInspirationTile("inspiration/yumie.jpg", "THE START OF SOMETHING YUM-IE", "We always wanted to design chocolate bars and finally did it. Introducing our sweet new brand."),
        addInspirationTile("inspiration/words-ideas.jpg", "SHARE SOME DESIGN LOVE", "The i.e. design promo journals encourage clients to sketch their big ideas and capture their dreams."),
        addInspirationTile("inspiration/cook-ie.jpg", "GOTTA LOVE A COOK-IE", "How a secret recipe works to bring relationships to a whole new level."),
        addInspirationTile("inspiration/remix.jpg", "REMIX", "A behind-the-scenes look at how we transformed classic memory carriers into objects of art."),
        addInspirationTile("inspiration/krempa.png", "REBRANDING A FAMILY BUSINESS", "A refresh for a 50-year legacy."),
        addInspirationTile("inspiration/fotostori.jpg", "BRANDING FROM THE NAME UP", "When a client had an idea for a brand spinoff, we took her concept to reality and launched the business in high style."),
        addInspirationTile("inspiration/inspired-2-create.jpg", "INSPIRED 2 CREATE", "A painting inspired by the i.e. design logo combines oil paints, ground up crayons, and a lego."),
        addInspirationTile("inspiration/from-inside.jpg", "THE VIEW FROM INSIDE", "i.e. design's new studio was 30 years in the making."),
        addInspirationTile("inspiration/reconnecting.jpg", "RECONNECTING", "How uncertain times led to a homecoming for i.e. design's senior designer."),
        addInspirationTile("inspiration/new-studio.jpg", "NEW STUDIO. NEW VIEW.", "How the need for inspiration fueled the building of a studio."),
    ];

    const scrollPadding = addScrollPadding();

    registerUpdateLayout(() => {
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
