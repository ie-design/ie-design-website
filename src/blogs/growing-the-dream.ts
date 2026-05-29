import { aligningWithGapsY, BoxElement, px, styleText } from "../layout";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollText, getScrollHeight, resizeScrollContainerFull } from "../scroll";

export function addGrowingTheDreamBlog() {
    const blogItems: (BoxElement | number)[] = [];

    let queuedGap: number | undefined;

    function goof<T extends HTMLElement>(builder: (text: string) => T, followingGap: number) {
        const group: T[] = [];
        return [
            (text: string) => {
                const element = builder(text);
                group.push(element);

                if (queuedGap && element instanceof HTMLParagraphElement) {
                    blogItems.push(queuedGap);
                }
                blogItems.push(element);
                queuedGap = followingGap;
            },
            group,
        ] as const;
    }

    const [addImage, _] = goof((srcPredicate: string) => addScrollImage(`blog/growing-the-dream/${srcPredicate}`), 0);
    const [addHead, heads] = goof((text: string) => addScrollText(text), 0.018);
    const [addSubhead, subheads] = goof((text: string) => addScrollText(text), 0.015);
    const [addParagraph, paragraphs] = goof((text: string) => addScrollText(text), 0.018);

    const addSpace = () => blogItems.push(0.03);

    addImage("telly-tape.jpg");
    addSpace();
    addHead("REMIX");
    addParagraph("By Lee Lipscomb");
    addParagraph("I love learning how things are created. Whether it’s a podcast about how the parts of a song come together or a behind-the-scenes video explaining the making of a unique film sequence, I’m always inspired by creative problem solving. So I thought it would be fun to share how i.e. design elevated some very old objects into classy images for our client, Fotostori.");
    addParagraph("Fotostori is a company solely dedicated to the archiving of treasured images, audio recordings, and films. It was important to show these “memory carriers” on the website to communicate the archiving concept. In their original state, however, these film reels, VHS tapes and other items looked dingy, weathered, even rusty.  We didn’t want the site to look like a yard sale. It needed to reflect an upscale curation company. The challenge was how to give these objects a more elevated appearance. Our solution brought them front and center in a smart, creative way.");
    addSubhead("Digging in my closets.");
    addParagraph("We decided to paint all of the objects matte white so they’d become more symbolic design elements than literal representations of the various media. Fortunately, I had a large collection of most of the items that we needed. Having digitized my family’s slides and 8mm films, I was able to use the original reels and film strips, along with the coveted carousel. The VHS and cassette tapes were also easy, since I had several of those as well. So it was a quick task to assemble them for the painting process. ");
    addSpace();
    addImage("raw-media.jpg");
    addImage("wheels.jpg");
    addSpace();
    addSubhead("Lots of spray paint.");
    addParagraph("The objects were prepped by cleaning surfaces, removing stickers and smoothing any rough edges with sandpaper. Beth and I have a go-to brand of white, matte spray paint that we’ve used on other projects. An outdoor area was set up for the spraying. Light layers of paint were built up over two days. A few cans of spray paint and several face masks later, we had the objects ready for our photo shoot.");
    addSpace();
    addImage("paint.jpg");
    addSpace();
    addSubhead("Fetch me a T-Square.");
    addParagraph("Composing the objects for these shots drew on my many years of experience as an art director and stylist. I wanted to create a balance of tension and flow, all while making sure the objects could actually be recognized. My T-square and triangles came in handy as I worked to get everything as aligned “in camera” as possible. Photoshop can correct many errors, but it’s best to take care of this kind of thing on set to save time.");
    addSpace();
    addImage("white-media.jpg");
    addSpace();
    addSubhead("Ordinary to extraordinary.");
    addParagraph("The objects were arranged on a clean white surface. I mounted the camera to a boom arm so the shots had an overhead orientation. A soft box provided the lighting. Once our client approved the composition, each image was converted to black and white. The result is a clean, elegant representation of Fotostori’s excellent service and uncompromising attention to detail. Check out the image in use on the");
    addSpace();
    addImage("composed-white-media.jpg");
    addSpace();
    addParagraph("Lee Lipscomb is i.e. design’s Senior Designer. The cassette tape featured is a recording of a 1973 Telly Savalas album called “Telly.”  It includes his stunning cover of the song “If.” You can enjoy it on video here.");

    registerUpdateLayout(() => {
        resizeScrollContainerFull();

        const s = innerWidth;

        const scrollHeight = getScrollHeight();
        const scrollLeft = scrollHeight * 0.5;
        const fit = innerWidth - scrollLeft * 2;

        for (const head of heads) {
            styleText(head, { letterSpacing: 0.0009 * s, fontWeight: 400, color: "#B3B3B3", fontSize: 0.025 * s, width: 1 * s, lineHeight: 0.02 * s });
        }
        for (const subhead of subheads) {
            styleText(subhead, { letterSpacing: 0.0009 * s, fontWeight: 600, color: "#000000", fontSize: 0.011 * s, width: 1 * s, lineHeight: 0.02 * s });
        }
        for (const paragraph of paragraphs) {
            styleText(paragraph, { letterSpacing: 0.0009 * s, fontWeight: 350, color: "#000000", fontSize: 0.011 * s, width: 1 * s, lineHeight: 0.019 * s });
        }
        for (const t of blogItems) {
            if (t instanceof HTMLElement) {
                t.style.width = px(fit);
            }
        }

        const q = blogItems.map((b) => (b instanceof Element ? b : b * s));
        const [elementAlignments, _] = aligningWithGapsY(q);
        for (const { element, offset } of elementAlignments) {
            element.style.top = px(offset);
            element.style.left = px((innerWidth - fit) / 2);
        }
    });
}
