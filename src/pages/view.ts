import { footer, LANDING_SVG_SCALE, mobileTopGap, TEXT_SQUARE_GAP_DESKTOP, TEXT_SQUARE_WIDTH_DESKTOP, textSquareLayoutDesktop, textSquareLayoutMobile } from "../components";
import { isLandscape } from "../layout";
import { Align, Axis, flow, gap, imageByWidth, imageWithFillHeight, imageWithFillWidth, imageWithHeight, imageWithWidth, run } from "../newLayoutEngine";
import { registerUpdateLayout, shouldElementOutlastPage } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollTextSquare, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait } from "../scroll";
import { contentWidthMobile } from "../site";
import { theme } from "../theme";
import { interlaceWithBetween } from "../util";

let homeFromIntro: [SVGSVGElement, SVGSVGElement] | undefined;
export function setHomeFromIntro(home: [SVGSVGElement, SVGSVGElement]) {
    homeFromIntro = home;
}

export function addNewHomeScrollSvgs(): [SVGSVGElement, SVGSVGElement] {
    return [addScrollSvg("view/home-desktop.svg"), addScrollSvg("view/home-mobile.svg")];
}

function homeMaybeFromIntro() {
    const h = homeFromIntro ?? addNewHomeScrollSvgs();
    if (homeFromIntro) {
        homeFromIntro.forEach((el) => shouldElementOutlastPage.delete(el));
        homeFromIntro = undefined;
    }
    return h;
}

export function addViewPage() {
    const [homeDesktop, homeMobile] = homeMaybeFromIntro();

    const horizon = addScrollImage("view/horizon.jpg");
    const freshLook = addScrollSvg("view/fresh-look.svg");
    const imageTextSquares = [
        { image: addScrollImage("view/great-brands.jpg"), textSquare: addScrollTextSquare("GREAT BRANDS DON’T JUST HAPPEN", "They require exploration, insight, and tenacity. We hunt for that magic spark that ignites innovation. We bring our extensive skills and experience to each project and give it our all. The result is clear, yet elevated communication that makes people stop, think, and often smile.", "Our studio location is profoundly inspiring. The magnificent view feeds our souls and keeps us inspired to do our best work. It's a place where creative people come together to collaborate and drill down to the heart of the matter. To solve problems and bring ideas to life. To create things worth remembering.") },
        { image: addScrollImage("view/insight-clarity.jpg"), textSquare: addScrollTextSquare("WE BRING VISION, INSIGHT, AND CLARITY TO EVERY PROJECT", "Successful design starts with identifying a client's needs, goals, and aspirations. Our objectivity shines light on what others have missed. We have the ability to see and interpret the inner workings, culture, and nuances of our client's world. We ask questions – lots of questions. Then listen until we gain the deep understanding necessary to build the solid foundation that any enduring brand needs.", "Our small but mighty team brings together a wide range of talents and perspectives, plus a nice list of awards. We throw our hearts into our work and are known for our fierce commitment to the trusted, long-term partnerships we form. For us, it's personal.") },
        { image: addScrollImage("view/skyward.jpg"), textSquare: addScrollTextSquare("WE SEE WORK IN A DIFFERENT LIGHT", "People like to ask about our design process. The truth is that the approach to each project varies, because each client and their needs are unique. Creative breakthroughs don't follow the clock. They can happen any time of day – or night. Whether an epiphany is illuminated in a scribble, a dream, or as the clouds roll by, we embrace the fact that each project takes on a life of its own.", "What's constant is our ability to listen and focus, to analyze and connect dots, and to remain curious. The most rewarding projects are with clients who value the balance between pushing forward and allowing time for the perfect solution to emerge. That's our happy place.") },
    ];
    const nextPillarButton = addNextPillarButton("work");
    const scrollPadding = addScrollPadding();

    const desktopLayout = flow(
        Axis.X,
        [
            imageWithHeight(homeDesktop, LANDING_SVG_SCALE), // -
            gap(TEXT_SQUARE_GAP_DESKTOP),
            imageWithFillHeight(horizon),
            gap(TEXT_SQUARE_GAP_DESKTOP),
            imageWithWidth(freshLook, TEXT_SQUARE_WIDTH_DESKTOP),
            gap(TEXT_SQUARE_GAP_DESKTOP),
            ...interlaceWithBetween(
                imageTextSquares.flatMap((i) => [
                    imageWithFillHeight(i.image), // -
                    textSquareLayoutDesktop(i.textSquare, theme.neutralFront),
                ]),
                gap(TEXT_SQUARE_GAP_DESKTOP)
            ),
            ...footer(nextPillarButton, scrollPadding),
        ],

        { h: (c) => c.s }
    );

    const mobileLayout = flow(
        Axis.Y,
        [
            mobileTopGap(),
            imageByWidth(homeMobile, () => contentWidthMobile(), { align: Align.Center }),
            gap(0.1),
            imageWithFillWidth(horizon),
            gap(0.1),
            imageWithWidth(freshLook, 0.85),
            gap(0.1),
            ...interlaceWithBetween(
                imageTextSquares.flatMap((i) => [
                    imageWithFillWidth(i.image), // -
                    textSquareLayoutMobile(i.textSquare, theme.neutralFront),
                ]),
                gap(0.08)
            ),
            ...footer(nextPillarButton, scrollPadding),
        ],
        { w: (c) => c.s }
    );

    registerUpdateLayout(() => {
        const landscape = isLandscape();
        homeDesktop.style.display = landscape ? "" : "none";
        homeMobile.style.display = landscape ? "none" : "";

        if (landscape) {
            resizeScrollContainerLandscape();
            run(desktopLayout, getScrollHeight());
        } else {
            resizeScrollContainerPortrait();
            run(mobileLayout, getScrollWidth());
        }
    });
}
