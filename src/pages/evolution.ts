import { fadeInAnimation, gray, ieGreen } from "../constants";
import { isLandscape, lastLineMetrics, NEXT_PILLAR_BUTTON_PAD, sizeY, styleSingleLineText, styleText } from "../layout";
import { Align, Axis, Box, el, flow, gap, imageWithFillHeight, imageWithHeight, imageWithWidth, LayoutNode, run, setPosX, setPosY, setSizeX } from "../newLayoutEngine";
import { appendChildForPage, registerUpdateLayout } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollText, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, scrollContainer, styleNextPillarButton } from "../scroll";
import { interlaceWithBetween, interleaveArrays } from "../util";

interface Quote {
    quote: HTMLParagraphElement;
    author: HTMLParagraphElement;
    title: HTMLParagraphElement;
    openQuote: HTMLParagraphElement;
    closeQuote: HTMLParagraphElement;
}

function addQuote(quoteText: string, authorText: string, titleText: string): Quote {
    const quote = addScrollText(quoteText);
    const author = addScrollText(authorText);
    const title = addScrollText(titleText);
    const openQuote = addScrollText("“");
    const closeQuote = addScrollText("”");

    return { quote, author, title, openQuote, closeQuote };
}

function styleQuote({ quote, author, title, openQuote, closeQuote }: Quote, s: number) {
    styleText(quote, { letterSpacing: 0.0009 * s, fontWeight: 300, color: "#000000", fontSize: 0.032 * s, lineHeight: 0.065 * s });

    styleSingleLineText(author, { letterSpacing: 0.001 * s, fontWeight: 300, color: "#000000", fontSize: 0.035 * s });
    styleSingleLineText(title, { letterSpacing: 0.00075 * s, fontWeight: 300, color: "#000000", fontSize: 0.025 * s });

    const quoteTextDetails = { letterSpacing: 0.001 * s, fontWeight: 300, color: ieGreen, fontSize: 0.15 * s };
    styleSingleLineText(openQuote, quoteTextDetails);
    styleSingleLineText(closeQuote, quoteTextDetails);
}

function placeOpenMark(self: Box, quote: Box) {
    self.x = quote.x - self.w;
    self.y = quote.y;
}

function placeCloseMark(self: Box, quote: Box, quoteEl: HTMLElement) {
    const { width, top } = lastLineMetrics(quoteEl);
    self.x = quote.x + width;
    self.y = quote.y + top;
}

function quoteGroupDesktop(q: Quote) {
    const quoteN = el(q.quote);
    return flow(
        Axis.Y,
        [
            quoteN, // -
            gap(0.04),
            el(q.author, { align: Align.End }),
            gap(0.01),
            el(q.title, { align: Align.End }),

            el(q.openQuote, { float: true, place: (self) => placeOpenMark(self, quoteN.box) }),
            el(q.closeQuote, { float: true, place: (self) => placeCloseMark(self, quoteN.box, q.quote) }),
        ],
        {
            style: (c) => {
                styleQuote(q, c.s);
                setSizeX(q.quote, 0.75 * c.s);
            },
            align: Align.Center,
        }
    );
}

function quoteGroupMobile(q: Quote) {
    const quoteN = el(q.quote);
    return flow(
        Axis.Y,
        [
            quoteN, // -
            gap(0.04),
            el(q.author, { align: Align.End }),
            gap(0.01),
            el(q.title, { align: Align.End }),

            el(q.openQuote, { float: true, place: (self) => placeOpenMark(self, quoteN.box) }),
            el(q.closeQuote, { float: true, place: (self) => placeCloseMark(self, quoteN.box, q.quote) }),
        ],
        {
            style: (c) => {
                styleQuote(q, c.s);
                setSizeX(q.quote, 0.7 * c.s);
            },
            align: Align.Center,
        }
    );
}

function createTimelineLine() {
    const timelineLine = document.createElement("div");
    timelineLine.style.position = "absolute";
    timelineLine.style.animation = fadeInAnimation();
    timelineLine.style.backgroundColor = gray;
    appendChildForPage(scrollContainer, timelineLine);
    return timelineLine;
}

function withTimelineDesktop(node: LayoutNode, offsetFactor: number) {
    const line = createTimelineLine();
    line.style.width = "1px";
    node.post = () => {
        const offset = offsetFactor * getScrollHeight();
        const bottom = node.box.y + node.box.h;
        setPosX(line, node.box.x + node.box.w / 2);
        setPosY(line, bottom + offset);
        line.style.height = sizeY(scrollContainer) - bottom - offset + "px";
    };
    return node;
}

function withTimelineMobile(node: LayoutNode, offsetFactor: number) {
    const line = createTimelineLine();
    line.style.height = "1px";
    node.post = () => {
        const offset = offsetFactor * getScrollWidth();
        const left = node.box.x;
        setPosX(line, 0);
        setPosY(line, node.box.y + node.box.h / 2);
        line.style.width = left - offset + "px";
    };
    return node;
}

export function addEvolutionPage() {
    const evolution = addScrollSvg("evolution/evolution.svg");
    const evolutionHistory = addScrollSvg("evolution/evolution-history.svg");
    const logoFull = addScrollSvg("logo-full.svg");

    const promos: HTMLImageElement[] = [];
    for (let i = 1; i <= 5; i++) promos.push(addScrollImage(`evolution/promo-${i}.jpg`));

    const quotes = [
        addQuote("Our annual promo is always grounded in our identity but it’s fun to push limits and reinvent ourselves each year. The best part is <strong>hearing what our clients have to say.</strong>", "BETHLYN KRAKAUER", "Founder, i.e. design, inc."), // -
        addQuote("I love how you do stuff. I’m finding that these types of messages are really <strong>transforming relationships</strong> with people. They are just dreamy.", "DEBRA SCHATZKI", "Founder, BPP Wealth Solutions LLC"),
        addQuote("I see a lot of this special quality in your work. It’s not just about being intentional. You always bring in an element of <strong>surprise and delight.</strong>", "JOSH KRAKAUER", "Founder, Sculpt"),
        addQuote("Your approach works so well because it is really <strong>personal</strong> and equally <strong>professional.</strong>", "ANN SULLIVAN", "Founder, Ann Sullivan Organizing"),
        addQuote("You truly understand the unique positioning of a prospective client and are able to <strong>tell their story</strong> exactly as it should be told.", "DAVID YUN", "Principal, Varident LLC"),
        addQuote("Beth is quite frankly one of the <strong>most talented designers</strong> that I have ever had the privilege to work with. She always has a special way of making everything she touches turn to gold!", "DAVID RUSH", "President, ENV"),
    ];

    const nextPillarButton = addNextPillarButton("inspiration");
    const scrollPadding = addScrollPadding();

    const desktopLayout = flow(
        Axis.X,
        [
            withTimelineDesktop(imageWithHeight(evolution, 0.75), 0.06),
            gap(0.2),
            withTimelineDesktop(
                flow(
                    Axis.Y,
                    [
                        imageWithHeight(logoFull, 0.45), // -
                        gap(0.1),
                        imageWithHeight(evolutionHistory, 0.3),
                    ],
                    { align: Align.Center }
                ),
                0.06
            ),
            gap(0.3),
            ...interlaceWithBetween(
                interleaveArrays(
                    quotes.map((q) => withTimelineDesktop(quoteGroupDesktop(q), 0.09)),
                    promos.map((promo) => withTimelineDesktop(imageWithFillHeight(promo), -0.001))
                ),
                gap(0.3)
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
            gap(0.2),
            withTimelineMobile(imageWithWidth(evolution, 0.8), 0.02),
            gap(0.1),
            imageWithWidth(logoFull, 0.45), // -
            gap(0.1),
            imageWithWidth(evolutionHistory, 0.8),
            gap(0.3),
            ...interlaceWithBetween(
                interleaveArrays(
                    quotes.map((q) => withTimelineMobile(quoteGroupMobile(q), 0.09)),
                    promos.map((promo) => withTimelineMobile(imageWithWidth(promo, 1), -0.001))
                ),
                gap(0.3)
            ),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(nextPillarButton, { style: (c) => styleNextPillarButton(nextPillarButton, c.s), align: Align.Center }),
            gap(NEXT_PILLAR_BUTTON_PAD),
            el(scrollPadding),
        ],
        { h: (c) => c.s }
    );

    registerUpdateLayout(() => {
        if (isLandscape()) {
            resizeScrollContainerLandscape();
            const s = getScrollHeight();
            run(desktopLayout, s);
        } else {
            resizeScrollContainerPortrait();
            const s = getScrollWidth();
            run(mobileLayout, s);
        }
    });
}
