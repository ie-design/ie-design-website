import { SCROLL_TEXT_WIDTH_HEIGHT_PROPORTION } from "../constants";
import { aligningWithGapsX, aligningWithGapsY, isLandscape, px, sizeX } from "../layout";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollTextSquare, alignScrollTextSquare, centerWithinScrollX, centerWithinScrollY, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, styleScrollTextSquare, TextSquare } from "../scroll";

export function addViewPage() {
    const home = addScrollSvg("view/home.svg");
    home.style.animation = "";
    const horizon = addScrollImage("view/horizon.jpg");
    const freshLook = addScrollSvg("view/fresh-look.svg");
    const greatBrands = addScrollImage("view/great-brands.jpg");
    const textTile1 = addScrollTextSquare("GREAT BRANDS DON'T JUST HAPPEN", "They require exploration, insight, and tenacity. We hunt for that magic spark that ignites innovation. We bring our extensive skills and experience to each project and give it our all. The result is clear, yet elevated communication that makes people stop, think, and often smile.", "Our studio location is profoundly inspiring. The magnificent view feeds our souls and keeps us inspired to do our best work. It's a place where creative people come together to collaborate and drill down to the heart of the matter. To solve problems and bring ideas to life. To create things worth remembering.");
    const insightClarity = addScrollImage("view/insight-clarity.jpg");
    const textTile2 = addScrollTextSquare("WE BRING VISION, INSIGHT, AND CLARITY TO EVERY PROJECT", "Successful design starts with identifying a client's needs, goals, and aspirations. Our objectivity shines light on what others have missed. We have the ability to see and interpret the inner workings, culture, and nuances of our client's world. We ask questions – lots of questions. Then listen until we gain the deep understanding necessary to build the solid foundation that any enduring brand needs.", "Our small but mighty team brings together a wide range of talents and perspectives, plus a nice list of awards. We throw our hearts into our work and are known for our fierce commitment to the trusted, long-term partnerships we form. For us, it's personal.");
    const skyward = addScrollImage("view/skyward.jpg");
    const textTile3 = addScrollTextSquare("WE SEE WORK IN A DIFFERENT LIGHT", "People like to ask about our design process. The truth is that the approach to each project varies, because each client and their needs are unique. Creative breakthroughs don't follow the clock. They can happen any time of day – or night. Whether an epiphany is illuminated in a scribble, a dream, or as the clouds roll by, we embrace the fact that each project takes on a life of its own.", "What's constant is our ability to listen and focus, to analyze and connect dots, and to remain curious. The most rewarding projects are with clients who value the balance between pushing forward and allowing time for the perfect solution to emerge. That's our happy place.");

    const textTiles = [textTile1, textTile2, textTile3];

    const scrollPadding = addScrollPadding();

    registerUpdateLayout(() => {
        const HOME_HORIZON_PAD = 0.2;
        const FRESH_LOOK_PAD = 0.13;
        const IMAGE_TEXT_SQUARE_PAD = 0.17;

        if (isLandscape()) {
            resizeScrollContainerLandscape();
            const s = getScrollHeight();

            centerWithinScrollY(home, 0.95);
            centerWithinScrollY(horizon, 1);
            centerWithinScrollY(freshLook, 0.8);
            centerWithinScrollY(greatBrands, 1);
            centerWithinScrollY(insightClarity, 1);
            centerWithinScrollY(skyward, 1);

            for (const textTile of textTiles)
                styleScrollTextSquare(
                    textTile, // -
                    { letterSpacing: 0.0046 * s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.065 * s, width: SCROLL_TEXT_WIDTH_HEIGHT_PROPORTION * s, lineHeight: 0.09 * s },
                    { letterSpacing: 0.001 * s, fontWeight: 300, color: "#000000", fontSize: 0.03 * s, width: SCROLL_TEXT_WIDTH_HEIGHT_PROPORTION * s, lineHeight: 0.05 * s }
                );

            const [elementAlignments, _] = aligningWithGapsX([
                home, // -
                HOME_HORIZON_PAD * s,
                horizon,
                FRESH_LOOK_PAD * s,
                freshLook,
                FRESH_LOOK_PAD * s,
                greatBrands,
                IMAGE_TEXT_SQUARE_PAD * s,
                textTile1.major,
                IMAGE_TEXT_SQUARE_PAD * s,
                insightClarity,
                IMAGE_TEXT_SQUARE_PAD * s,
                textTile2.major,
                IMAGE_TEXT_SQUARE_PAD * s,
                skyward,
                IMAGE_TEXT_SQUARE_PAD * s,
                textTile3.major,
                IMAGE_TEXT_SQUARE_PAD * s,
                scrollPadding,
            ]);

            for (const { element, offset } of elementAlignments) {
                element.style.left = px(offset);
            }

            for (const textTile of textTiles) alignScrollTextSquare(textTile, 0.03 * s, 0.03 * s);
        } else {
            resizeScrollContainerPortrait();
            const s = getScrollWidth();

            centerWithinScrollX(home, 0.95);
            centerWithinScrollX(horizon, 1);
            centerWithinScrollX(freshLook, 0.85);
            centerWithinScrollX(greatBrands, 1);
            centerWithinScrollX(insightClarity, 1);
            centerWithinScrollX(skyward, 1);

            for (const textTile of textTiles)
                styleScrollTextSquare(
                    textTile, // -
                    { letterSpacing: 0.02 * s, fontWeight: 350, color: "#B3B3B3", fontSize: 0.06 * s, width: 1 * s, lineHeight: 0.08 * s },
                    { letterSpacing: 0.001 * s, fontWeight: 300, color: "#000000", fontSize: 0.028 * s, width: 1 * s, lineHeight: 0.05 * s }
                );

            const TEXT_TILE_WIDTH = 0.85;
            for (const textTile of textTiles) {
                centerWithinScrollX(textTile.major, TEXT_TILE_WIDTH);
                for (const minor of textTile.minors) centerWithinScrollX(minor, TEXT_TILE_WIDTH);
            }

            const MOBILE_PAD = 0.08;

            function mobileTile(textTile: TextSquare) {
                const x = [textTile.major, 0.0 * s];
                for (const minor of textTile.minors) x.push(0.04 * s, minor);
                return x;
            }

            const [elementAlignments, _] = aligningWithGapsY([
                home, // -
                MOBILE_PAD * s,
                horizon,
                MOBILE_PAD * s,
                freshLook,
                MOBILE_PAD * s,
                greatBrands,
                MOBILE_PAD * s,
                ...mobileTile(textTile1),
                MOBILE_PAD * s,
                insightClarity,
                MOBILE_PAD * s,
                ...mobileTile(textTile2),
                MOBILE_PAD * s,
                skyward,
                MOBILE_PAD * s,
                ...mobileTile(textTile3),
                MOBILE_PAD * s,
                scrollPadding,
            ]);
            for (const { element, offset } of elementAlignments) {
                element.style.top = px(offset);
            }
        }
    });
}
