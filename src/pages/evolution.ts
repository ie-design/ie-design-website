import { footer, LANDING_SVG_SCALE, mobileTopGap, TEXT_SQUARE_GAP_DESKTOP, TEXT_SQUARE_WIDTH_DESKTOP } from "../components";
import { isLandscape, lastLineMetrics, styleMultiLineText, styleSingleLineText } from "../layout";
import { Align, Axis, Box, el, flow, gap, imageWithFillHeight, imageWithHeight, imageWithWidth, LayoutNode, run, setSizeX } from "../newLayoutEngine";
import { appendChildForPage, fadeInAnimation, registerUpdateLayout } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollSvg, addScrollText, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, scrollContainer } from "../scroll";
import { leftEdgeItemAlignment, site } from "../site";
import { theme } from "../theme";
import { bold, interlaceWithBetween, interleaveArrays } from "../util";

interface Quote {
    quote: HTMLParagraphElement;
    author: HTMLParagraphElement;
    title: HTMLParagraphElement;
    openQuote: HTMLParagraphElement;
    closeQuote: HTMLParagraphElement;
}

function addQuote(quoteNodes: (Node | string)[], authorText: string, titleText: string): Quote {
    const quote = addScrollText(...quoteNodes);
    const author = addScrollText(authorText);
    const title = addScrollText(titleText);
    const openQuote = addScrollText("“");
    const closeQuote = addScrollText("”");

    return { quote, author, title, openQuote, closeQuote };
}

const TIMELINE_THICKNESS = 0.5;
const runningTimelineBaseDesktop = () => getScrollHeight() * 1.1;
const runningTimelineBaseMobile = () => leftEdgeItemAlignment();

function styleQuote({ quote, author, title, openQuote, closeQuote }: Quote, s: number) {
    styleMultiLineText(quote, { letterSpacing: 0 * s, fontWeight: 300, color: theme.bodyText, fontSize: 0.03 * s, lineHeight: 0.065 * s });

    styleSingleLineText(author, { letterSpacing: 0.001 * s, fontWeight: 300, color: theme.bodyText, fontSize: 0.035 * s });
    styleSingleLineText(title, { letterSpacing: 0.00075 * s, fontWeight: 300, color: theme.bodyText, fontSize: 0.025 * s });

    const quoteTextDetails = { letterSpacing: 0.001 * s, fontWeight: 300, color: theme.ieGreen, fontSize: 0.15 * s };
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
                setSizeX(q.quote, TEXT_SQUARE_WIDTH_DESKTOP * c.s);
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

function addTimelineLine() {
    const timelineLine = document.createElement("div");
    timelineLine.style.position = "absolute";
    timelineLine.style.animation = fadeInAnimation();
    timelineLine.style.backgroundColor = theme.neutralFront;
    timelineLine.style.zIndex = "-1";
    appendChildForPage(scrollContainer, timelineLine);
    return timelineLine;
}

export function addEvolutionPage() {
    const evolution = addScrollSvg("evolution/evolution.svg");
    const evolutionHistory = addScrollSvg("evolution/evolution-history.svg");
    const logoFull = addScrollSvg("logo-full.svg");

    const promos: HTMLImageElement[] = [];
    for (let i = 1; i <= 5; i++) promos.push(addScrollImage(`evolution/promo-${i}.jpg`));

    const quotes = [
        addQuote(["Our annual promo is always grounded in our identity but it's fun to push limits and reinvent ourselves each year. The best part is ", bold("hearing what our clients have to say.")], "BETHLYN KRAKAUER", "Founder, i.e. design, inc."), // -
        addQuote(["I love how you do stuff. I'm finding that these types of messages are really ", bold("transforming relationships"), " with people. They are just dreamy."], "DEBRA SCHATZKI", "Founder, BPP Wealth Solutions LLC"),
        addQuote(["I see a lot of this special quality in your work. It's not just about being intentional. You always bring in an element of ", bold("surprise and delight.")], "JOSH KRAKAUER", "Founder, Sculpt"),
        addQuote(["Your approach works so well because it is really ", bold("personal"), " and equally ", bold("professional.")], "ANN SULLIVAN", "Founder, Ann Sullivan Organizing"),
        addQuote(["You truly understand the unique positioning of a prospective client and are able to ", bold("tell their story"), " exactly as it should be told."], "DAVID YUN", "Principal, Varident LLC"),
        addQuote(["Beth is quite frankly one of the ", bold("most talented designers"), " that I have ever had the privilege to work with. She always has a special way of making everything she touches turn to gold!"], "DAVID RUSH", "President, ENV"),
    ];

    const evolutionTimeline = addTimelineLine();
    const historyTimeline = addTimelineLine();
    const quotesWithTimelines = quotes.map((quote) => ({ quote, timeline: addTimelineLine() }));
    const promosWithTimelines = promos.map((promo) => ({ promo, timeline: addTimelineLine() }));
    const runningTimeline = addTimelineLine();

    const nextPillarButton = addNextPillarButton("connect");
    const scrollPadding = addScrollPadding();

    const desktopTimelines: LayoutNode[] = [];
    const withTimelineDesktop = (node: LayoutNode, line: HTMLElement, scaleToElement: number) => {
        const lineNode = el(line, {
            float: true,
            applySize: true,
            place: (self) => {
                const nodeBottom = node.box.y + node.box.h;

                const start = runningTimelineBaseDesktop();
                const startToElementDistance = start - nodeBottom;
                const scaledDistance = startToElementDistance * scaleToElement;
                const end = start - scaledDistance;

                self.x = node.box.x + node.box.w / 2;
                self.y = end;
                self.w = TIMELINE_THICKNESS;
                self.h = scaledDistance;
            },
        });
        desktopTimelines.push(lineNode);
        return node;
    };

    const mobileTimelines: LayoutNode[] = [];
    const withTimelineMobile = (node: LayoutNode, line: HTMLElement, scaleToElement: number, customY?: (node: LayoutNode) => number) => {
        const lineNode = el(line, {
            float: true,
            applySize: true,
            place: (self) => {
                const nodeLeft = node.box.x;

                const start = runningTimelineBaseMobile();
                const startToElementDistance = nodeLeft - start;
                const scaledDistance = startToElementDistance * scaleToElement;

                self.y = customY ? customY(node) : node.box.y + node.box.h / 2;
                self.x = start;
                self.h = TIMELINE_THICKNESS;
                self.w = scaledDistance;
            },
        });
        mobileTimelines.push(lineNode);
        return node;
    };

    const runningTimelineNodeDesktop = el(runningTimeline, {
        float: true,
        applySize: true,
        place: (self) => {
            const first = desktopTimelines.reduce((a, b) => (b.box.x < a.box.x ? b : a));
            const last = desktopTimelines.reduce((a, b) => (b.box.x > a.box.x ? b : a));
            self.x = first.box.x;
            self.y = first.box.y + first.box.h;
            self.w = last.box.x - first.box.x;
            self.h = TIMELINE_THICKNESS;
        },
    });

    const runningTimelineNodeMobile = el(runningTimeline, {
        float: true,
        applySize: true,
        place: (self) => {
            const first = mobileTimelines.reduce((a, b) => (b.box.y < a.box.y ? b : a));
            const last = mobileTimelines.reduce((a, b) => (b.box.y > a.box.y ? b : a));
            self.y = first.box.y;
            self.x = first.box.x;
            self.h = last.box.y - first.box.y;
            self.w = TIMELINE_THICKNESS;
        },
    });

    const desktopLayout = flow(
        Axis.X,
        [
            withTimelineDesktop(imageWithHeight(evolution, LANDING_SVG_SCALE), evolutionTimeline, 0.7),
            gap(TEXT_SQUARE_GAP_DESKTOP),
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
                historyTimeline,
                0.7
            ),
            gap(TEXT_SQUARE_GAP_DESKTOP),
            ...interlaceWithBetween(
                interleaveArrays(
                    quotesWithTimelines.map((q) => withTimelineDesktop(quoteGroupDesktop(q.quote), q.timeline, 0.9)),
                    promosWithTimelines.map((p) => withTimelineDesktop(imageWithFillHeight(p.promo), p.timeline, 1))
                ),
                gap(TEXT_SQUARE_GAP_DESKTOP)
            ),
            ...footer(nextPillarButton, scrollPadding),
            ...desktopTimelines,
            runningTimelineNodeDesktop,
        ],
        { h: (c) => c.s }
    );

    const mobileLayout = flow(
        Axis.Y,
        [
            mobileTopGap(),
            withTimelineMobile(imageWithWidth(evolution, 0.8), evolutionTimeline, 1.8, (node) => node.box.y * 0.3),
            gap(0.1),
            imageWithWidth(logoFull, 0.45), // -
            gap(0.1),
            withTimelineMobile(imageWithWidth(evolutionHistory, 0.8), historyTimeline, 0.6),
            gap(0.3),
            ...interlaceWithBetween(
                interleaveArrays(
                    quotesWithTimelines.map((q) => withTimelineMobile(quoteGroupMobile(q.quote), q.timeline, 0.7)),
                    promosWithTimelines.map((p) => withTimelineMobile(imageWithWidth(p.promo, 1), p.timeline, 1))
                ),
                gap(0.3)
            ),
            ...footer(nextPillarButton, scrollPadding),
            ...mobileTimelines,
            runningTimelineNodeMobile,
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
