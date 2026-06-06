import { SCROLL_TEXT_WIDTH_HEIGHT_PROPORTION } from "../constants";
import { isLandscape, NEXT_PILLAR_BUTTON_PAD } from "../layout";
import { Align, Axis, el, flow, gap, imageWithFillHeight, imageWithFillWidth, imageWithHeight, imageWithWidth, LayoutNode, run, setSizeX } from "../newLayoutEngine";
import { registerUpdateLayout, shouldElementOutlastPage } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollTextSquare, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, styleNextPillarButton, styleNextPillarButtonMobile, styleScrollTextSquare, TextSquare } from "../scroll";
import { interlaceWithBetween } from "../util";

let homeFromIntro: SVGSVGElement | undefined;
export function setHomeFromIntro(home: SVGSVGElement) {
    homeFromIntro = home;
}

function homeMaybeFromIntro() {
    const h = homeFromIntro ?? addScrollSvg("view/home.svg");
    if (homeFromIntro) {
        shouldElementOutlastPage.delete(homeFromIntro);
        homeFromIntro = undefined;
    }
    return h;
}

function textSquareItems(square: TextSquare, majorToMinorGap: number, betweenMinorsGap: number): LayoutNode[] {
    return [
        el(square.major),
        gap(majorToMinorGap),
        ...interlaceWithBetween(
            square.minors.map((m) => el(m)),
            gap(betweenMinorsGap)
        ),
    ];
}

function textSquareDesktop(square: TextSquare) {
    return flow(Axis.Y, textSquareItems(square, 0.03, 0.03), {
        style: (c) => styleScrollTextSquare(square, { letterSpacing: 0.0046 * c.s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.065 * c.s, lineHeight: 0.09 * c.s }, { letterSpacing: 0.001 * c.s, fontWeight: 300, color: "#000000", fontSize: 0.03 * c.s, lineHeight: 0.05 * c.s }, SCROLL_TEXT_WIDTH_HEIGHT_PROPORTION * c.s),
        align: Align.Center,
    });
}

function textSquareMobile(square: TextSquare) {
    return flow(Axis.Y, textSquareItems(square, 0.04, 0.04), {
        style: (c) => styleScrollTextSquare(square, { letterSpacing: 0.003 * c.s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.06 * c.s, lineHeight: 0.08 * c.s }, { letterSpacing: 0.001 * c.s, fontWeight: 300, color: "#000000", fontSize: 0.028 * c.s, lineHeight: 0.05 * c.s }, 0.85 * c.s),
        align: Align.Center,
    });
}

export function addViewPage() {
    const home = homeMaybeFromIntro();
    const horizon = addScrollImage("view/horizon.jpg");
    const freshLook = addScrollSvg("view/fresh-look.svg");
    const greatBrands = addScrollImage("view/great-brands.jpg");
    const textTile1 = addScrollTextSquare("GREAT BRANDS DON'T JUST HAPPEN", "They require exploration, insight, and tenacity. We hunt for that magic spark that ignites innovation. We bring our extensive skills and experience to each project and give it our all. The result is clear, yet elevated communication that makes people stop, think, and often smile.", "Our studio location is profoundly inspiring. The magnificent view feeds our souls and keeps us inspired to do our best work. It's a place where creative people come together to collaborate and drill down to the heart of the matter. To solve problems and bring ideas to life. To create things worth remembering.");
    const insightClarity = addScrollImage("view/insight-clarity.jpg");
    const textTile2 = addScrollTextSquare("WE BRING VISION, INSIGHT, AND CLARITY TO EVERY PROJECT", "Successful design starts with identifying a client's needs, goals, and aspirations. Our objectivity shines light on what others have missed. We have the ability to see and interpret the inner workings, culture, and nuances of our client's world. We ask questions – lots of questions. Then listen until we gain the deep understanding necessary to build the solid foundation that any enduring brand needs.", "Our small but mighty team brings together a wide range of talents and perspectives, plus a nice list of awards. We throw our hearts into our work and are known for our fierce commitment to the trusted, long-term partnerships we form. For us, it's personal.");
    const skyward = addScrollImage("view/skyward.jpg");
    const textTile3 = addScrollTextSquare("WE SEE WORK IN A DIFFERENT LIGHT", "People like to ask about our design process. The truth is that the approach to each project varies, because each client and their needs are unique. Creative breakthroughs don't follow the clock. They can happen any time of day – or night. Whether an epiphany is illuminated in a scribble, a dream, or as the clouds roll by, we embrace the fact that each project takes on a life of its own.", "What's constant is our ability to listen and focus, to analyze and connect dots, and to remain curious. The most rewarding projects are with clients who value the balance between pushing forward and allowing time for the perfect solution to emerge. That's our happy place.");
    const nextPillarButton = addNextPillarButton("work");
    const scrollPadding = addScrollPadding();

    const desktopLayout = flow(
        Axis.X,
        [
            imageWithHeight(home, 0.95), // -
            gap(0.2),
            imageWithFillHeight(horizon),
            gap(0.13),
            imageWithHeight(freshLook, 0.8),
            gap(0.13),
            ...interlaceWithBetween(
                [
                    imageWithFillHeight(greatBrands), // -
                    textSquareDesktop(textTile1),
                    imageWithFillHeight(insightClarity),
                    textSquareDesktop(textTile2),
                    imageWithFillHeight(skyward),
                    textSquareDesktop(textTile3),
                ],
                gap(0.17)
            ),
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
            ...interlaceWithBetween(
                [
                    imageWithWidth(home, 0.95), // -
                    imageWithFillWidth(horizon),
                    imageWithWidth(freshLook, 0.85),
                    imageWithFillWidth(greatBrands),
                    textSquareMobile(textTile1),
                    imageWithFillWidth(insightClarity),
                    textSquareMobile(textTile2),
                    imageWithFillWidth(skyward),
                    textSquareMobile(textTile3),
                ],
                gap(0.08)
            ),
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
