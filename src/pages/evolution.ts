import { fadeInAnimation, gray, ieGreen } from "../constants";
import { aligningWithGapsX, aligningWithGapsY, BoxElement, posX, posY, px, sizeX, sizeY, styleText } from "../layout";
import { appendChildForPage, registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollText, centerWithinScrollY, getScrollHeight, resizeScrollContainerLandscape, scrollContainer } from "../scroll";

interface Quote {
    quote: HTMLParagraphElement;
    author: HTMLParagraphElement;
    title: HTMLParagraphElement;
    openQuote: HTMLParagraphElement;
    closeQuote: HTMLParagraphElement;
}

function addQuote(quoteText: string, authorText: string, titleText: string): Quote {
    const quote = addScrollText(quoteText);
    quote.style.animation = ""; // can't animate in otherwise close quote bounding box shit gets confused
    const author = addScrollText(authorText);
    const title = addScrollText(titleText);
    const openQuote = addScrollText("“");
    const closeQuote = addScrollText("”");

    return { quote, author, title, openQuote, closeQuote };
}

function styleQuote({ quote, author, title, openQuote, closeQuote }: Quote) {
    const s = getScrollHeight();
    const widthScale = 0.75;
    styleText(quote, { letterSpacing: 0.18, fontWeight: 350, color: "#000000", fontSize: 0.032 * s, width: widthScale * s, lineHeight: 0.065 * s });

    styleText(author, { letterSpacing: 0.2, fontWeight: 350, color: "#000000", fontSize: 0.035 * s, width: widthScale * s, lineHeight: 0.06 * s });
    author.style.textAlign = "right";

    styleText(title, { letterSpacing: 0.15, fontWeight: 350, color: "#000000", fontSize: 0.025 * s, width: widthScale * s, lineHeight: 0.06 * s });
    title.style.textAlign = "right";

    const quoteTextDetails = { letterSpacing: 0.2, fontWeight: 350, color: ieGreen, fontSize: 0.15 * s, width: 0.05 * s, lineHeight: 0.06 * s };
    styleText(openQuote, quoteTextDetails);
    styleText(closeQuote, quoteTextDetails);
}

function layoutQuote({ quote, author, title, openQuote, closeQuote }: Quote) {
    const s = getScrollHeight();

    author.style.left = px(posX(quote));
    title.style.left = px(posX(quote));

    const [elementAlignments, _] = aligningWithGapsY([
        quote, //
        0.04 * s,
        author,
        -0.015 * s,
        title,
    ]);

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(offset + 0.35 * s);
    }

    // ZZZZ this is sorta jank. again, close quote bounding box gets confused
    // setTimeout(() => {
    const range = document.createRange();
    range.selectNodeContents(quote);
    const rects = range.getClientRects();
    const scrollContainerRect = scrollContainer.getBoundingClientRect();
    const lastTextLineRect = rects[rects.length - 1];
    const lastRectLeft = lastTextLineRect.left - scrollContainerRect.left + scrollContainer.scrollLeft;

    openQuote.style.left = px(posX(quote) - 0.07 * s);
    openQuote.style.top = px(posY(quote) + 0.05 * s);
    closeQuote.style.left = px(lastRectLeft + lastTextLineRect.width);
    closeQuote.style.top = px(posY(quote) + sizeY(quote) - 0.01 * s);
    // }, 100);
}

function createTimelineLine() {
    const timelineLine = document.createElement("div");
    timelineLine.style.position = "absolute";
    timelineLine.style.animation = fadeInAnimation();
    timelineLine.style.backgroundColor = gray;
    timelineLine.style.width = px(1);
    appendChildForPage(scrollContainer, timelineLine);
    return timelineLine;
}

export function addEvolutionPage() {
    const evolution = addScrollSvg("evolution/evolution.svg");
    const evolutionHistory = addScrollSvg("evolution/evolution-history.svg");
    const logoFull = addScrollSvg("logo-full.svg");

    const promos: HTMLImageElement[] = [];
    for (let i = 1; i <= 5; i++) promos.push(addScrollImage(`evolution/promo-${i}.jpg`));

    const quotes = [addQuote("Our annual promo is always grounded in our identity but it's fun to push limits and reinvent ourselves each year. The best part is <strong>hearing what our clients have to say.</strong>", "BETHLYN KRAKAUER", "Founder, i.e. design, inc."), addQuote("I love how you do stuff. I'm finding that these types of messages are really <strong>transforming relationships</strong> with people. They are just dreamy.", "DEBRA SCHATZKI", "Founder, BPP Wealth Solutions LLC"), addQuote("I see a lot of this special quality in your work. It's not just about being intentional. You always bring in an element of <strong>surprise and delight.</strong>", "JOSH KRAKAUER", "Founder, Sculpt"), addQuote("Your approach works so well because it is really <strong>personal</strong> and equally <strong>professional.</strong>", "ANN SULLIVAN", "Founder, Ann Sullivan Organizing"), addQuote("You truly understand the unique positioning of a prospective client and are able to <strong>tell their story</strong> exactly as it should be told.", "DAVID YUN", "Principal, Varident LLC"), addQuote("Beth is quite frankly one of the <strong>most talented designers</strong> that I have ever had the privilege to work with. She always has a special way of making everything she touches turn to gold!", "DAVID RUSH", "President, ENV")];

    const timelineItems = [
        { element: evolution, offsetFactor: 0.06 }, //
        { element: evolutionHistory, offsetFactor: 0.06 },
        ...quotes.map((q) => ({ element: q.quote, offsetFactor: 0.2 })),
        ...promos.map((o) => ({ element: o, offsetFactor: -0.001 })),
    ];
    const timelines = timelineItems.map((timelineItem) => {
        const timelineLine = createTimelineLine();
        return { timelineLine, timelineItem };
    });

    const scrollPadding = addScrollPadding();

    registerUpdateLayout(() => {
        resizeScrollContainerLandscape();
        const s = getScrollHeight();

        centerWithinScrollY(evolution, 0.75);
        evolutionHistory.style.height = px(0.3 * s);
        logoFull.style.height = px(0.45 * s);

        for (const promo of promos) centerWithinScrollY(promo, 1);
        for (const quote of quotes) styleQuote(quote);

        const items: (BoxElement | number)[] = [evolution, 0.2 * s, evolutionHistory];

        const maxLength = Math.max(quotes.length, promos.length);
        for (let i = 0; i < maxLength; i++) {
            if (i < quotes.length) items.push(0.3 * s, quotes[i].quote);
            if (i < promos.length) items.push(0.3 * s, promos[i]);
        }
        items.push(0.2 * s, scrollPadding);

        const [elementAlignments, _] = aligningWithGapsX(items);

        for (const { element, offset } of elementAlignments) {
            element.style.left = px(offset);
        }

        evolutionHistory.style.top = px(posY(evolution) + sizeY(evolution) - sizeY(evolutionHistory));

        logoFull.style.left = px(posX(evolutionHistory) + (sizeX(evolutionHistory) - sizeX(logoFull)) / 2);
        logoFull.style.top = px(posY(evolutionHistory) - sizeY(logoFull) - 0.1 * s);

        for (const quote of quotes) layoutQuote(quote);

        for (const { timelineLine, timelineItem } of timelines) {
            const { element, offsetFactor } = timelineItem;
            const offset = s * offsetFactor;
            timelineLine.style.left = px(posX(element) + sizeX(element) / 2);
            timelineLine.style.top = px(posY(element) + sizeY(element) + offset);
            timelineLine.style.height = px(sizeY(scrollContainer) - (posY(element) + sizeY(element)) - offset);
        }
    });
}
