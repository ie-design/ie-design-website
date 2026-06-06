import { body } from "../constants";
import { isLandscape, NEXT_PILLAR_BUTTON_PAD, posX, posY } from "../layout";
import { Align, applyBox, Axis, center, containAspect, Ctx, debugBoxWith, el, flow, gap, imageWithHeight, imageWithWidth, LayoutNode, run, textSquareItems, virtual } from "../newLayoutEngine";
import { appendChildForPage, awaitLayout, flushPageContent, registerUpdateLayout } from "../page";
import { addNextPillarButton, addScrollImage, addScrollPadding, addScrollTextSquare, getHeaderBarHeight, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait, scrollContainer, styleNextPillarButton, TextSquare } from "../scroll";
import { effect, Signal } from "../signal";
import { animateSpringToTarget, Spring } from "../spring";
import { findWithMin, interlaceWithBetween, interlaceWithFactory, spaceToFile } from "../util";

const A_WIDTH = 1;
const A_HEIGHT = 1;
const B_MAX_WIDTH = 1;
const B_MAX_HEIGHT = 0.9;

interface WorkContent {
    name: string;
    description: string[];
}

interface WorkItem {
    textSquare: TextSquare;
    image1: HTMLImageElement;
    image2: HTMLImageElement;
}

const workContents: WorkContent[] = [
    {
        name: "berwyn",
        description: ["Having spent his entire childhood making films, this company's founder named his agency after the street on which he was raised. With a history like that, we had to elevate Berwyn to landmark status. Using custom photography and master manipulation, we created a flexible sticker system that is interchangeable with multi-colored paper stocks. Employees are encouraged to design their own communications and get a complete series of award-winning business cards to choose from.", "Industry: Film, Television, Video Production"],
    },
    {
        name: "k2 krupp",
        description: ["This award-winning, New York City public relations and marketing agency has a successful track record in igniting brands from start-ups, new authors, and celebrities by connecting them with cultural trends and influencers. When it came to representing their brand, K2 came to us. Bold, vibrant, and dynamic, this timeless identity system reflects the founder's favorite color and the company's energetic culture and environment.", "Industry: Public Relations & Marketing for Media"],
    },
    {
        name: "whym",
        description: ["After successfully branding their first eatery, this client returned to us to realize their dream of an upscale, Upper West Side eating destination.", "The custom letterform is a whimsical play on their unique spelling and can read upside down. The vibrant color palette was developed in partnership with the interior architecture team to create a warm and exciting atmosphere. The custom die-cut edge of the identity system mimics the curve of the unique, showcase bar.", "Industry: Restaurant & Bar"],
    },
    {
        name: "ann sullivan",
        description: ["Ann dreamed of being “the Oprah” of organizing. We established her name as the brand and created a tagline, which reflected the peace of mind that her clients get from having and maintaining an organized life. The simple icon series represents each area of expertise. As the company's services have expanded over the years, the identity system has evolved along with it and remains as fresh as it was day one.", "Industry: Professional Organizing"],
    },
    {
        name: "loa",
        description: ["This professional make-up artist team came to us to brand their patented “waterslide” eye pencil. Color names like “Giving Back Black,” reflect the company's commitment to providing makeovers for women facing health challenges. The playful packaging elevates a staple product to gift worthy and generates attention in a saturated market by flying above its display case. The motif holds special meaning for the founder who shared with us that the butterfly is a sign that her beloved mother is still with her.", "Industry: Beauty & Cosmetics"],
    },
    {
        name: "wet",
        description: ["This Master Architect and world-renowned spa designer used his reputation and expertise in hydrotherapy to launch an exclusive product line for luxury hotels and resorts. A soothing, muted color palette was designed to reflect the scent profile of each series of scrubs and lotions. Authentic water splash photography set the tone to promote the health benefits and art of bathing. The package design expanded to gift and travel sets that invite guests to take the luxury experience home.", "Industry: Health & Wellness Spas"],
    },
    {
        name: "ferragamo",
        description: ["Tasked with marketing office space above this luxury brand's Fifth Avenue flagship, we faced the challenge of an unknown, side street entrance. Handed nothing more than an architect's rendering, we elegantly branded the address, captured the energy of the location, and generated enough buzz to expand the viewing party to two dates by luring brokers with the promise of a Ferragamo tie. The results were a quick closing and a feature article in Crain's NY Business citing our innovation and success in a challenging real estate market.", "Industries: Luxury Fashion, Real Estate"],
    },
];

export function addWorkPage() {
    // elements

    const tabImages = workContents.map((workContent) => {
        const tabImage = document.createElement("img");
        tabImage.style.position = "absolute";
        tabImage.style.cursor = "pointer";
        tabImage.style.zIndex = "1";
        tabImage.src = `work/${spaceToFile(workContent.name)}/tab.png`;

        awaitLayout(tabImage.decode());
        appendChildForPage(body, tabImage);

        return tabImage;
    });

    const tuckedTabShelf = document.createElement("div");
    tuckedTabShelf.style.position = "absolute";
    tuckedTabShelf.style.background = "white";
    appendChildForPage(body, tuckedTabShelf);

    // layout

    const debugBox = debugBoxWith((div) => appendChildForPage(body, div));

    const cellCount = tabImages.length * 2 - 1;
    const cellWidth = (c: Ctx) => c.parent.w / cellCount;
    const tabAspect = () => tabImages[0].naturalWidth / tabImages[0].naturalHeight;
    const tabHeight = (c: Ctx) => cellWidth(c) / tabAspect();

    const tabReadyNormal = tabImages.map(() => virtual({ w: cellWidth, h: tabHeight }));

    const tabsTightContainer = flow(
        Axis.X,
        interlaceWithFactory(tabReadyNormal, () => virtual({ w: cellWidth })),
        containAspect(() => cellCount * tabAspect(), B_MAX_WIDTH, B_MAX_HEIGHT)
    );

    const allFloating: LayoutNode[] = [];
    const buildTabsWithY = (getY: (tabNode: LayoutNode) => number) => {
        const tabsWithY = tabReadyNormal.map((tabNode) =>
            virtual({
                float: true,
                place: (self) => {
                    self.x = tabNode.box.x;
                    self.y = getY(tabNode);
                    self.w = tabNode.box.w;
                    self.h = tabNode.box.h;
                },
            })
        );
        allFloating.push(...tabsWithY);
        return tabsWithY;
    };

    const tabReadyHover = buildTabsWithY((tabNode) => tabNode.box.y - tabNode.box.w / 2);
    const tabTuckedNormal = buildTabsWithY((tabNode) => innerHeight - tabNode.box.w / 2);
    const tabTuckedHover = buildTabsWithY((tabNode) => innerHeight - tabNode.box.w);

    const tuckedTabShelfNode = el(tuckedTabShelf, {
        float: true,
        place: (self) => {
            const h = tabTuckedHover[0].box.w * 1.5;
            self.x = 0;
            self.y = innerHeight - h;
            self.w = innerWidth;
            self.h = h;
        },
        post: () => applyBox(tuckedTabShelf, tuckedTabShelfNode.box),
    });
    allFloating.push(tuckedTabShelfNode);

    const fromLeft = () => (isLandscape() ? innerHeight * 0.34 : innerWidth * 0.08);
    const fromRight = () => (isLandscape() ? innerHeight * 0.2 : innerWidth * 0.08);
    const tabsOuterBounds = center([tabsTightContainer, ...allFloating], {
        w: () => innerWidth - fromRight() - fromLeft(),
        h: () => A_HEIGHT * innerHeight,
        place: (self) => (self.x = fromLeft()),
    });

    // animation

    type Mode = "ready" | "tucked";
    let mode: Mode = "ready";

    class TabAnimation {
        private spring = new Spring(0);
        private sig = new Signal();
        private hovered = false;
        isCurrentViewed = false;

        constructor(readonly img: HTMLImageElement, readonly i: number) {
            this.spring.setStiffnessCritical(150);
            effect(() => applyBox(this.img, { ...tabReadyNormal[this.i].box, y: this.spring.position }), [this.sig]);

            this.img.onmouseenter = () => this.setHovered(true);
            this.img.onmouseleave = () => this.setHovered(false);
            this.img.onclick = () => enterWorkView(this.i);
        }

        private setHovered = (hovered: boolean) => {
            this.hovered = hovered;
            this.chase();
        };

        private targetY = () => {
            const [normal, hover] = mode === "ready" ? [tabReadyNormal, tabReadyHover] : [tabTuckedNormal, tabTuckedHover];
            return (this.hovered || this.isCurrentViewed ? hover : normal)[this.i].box.y;
        };

        setCurrentViewed = (currentViewed: boolean) => {
            this.isCurrentViewed = currentViewed;
            this.chase();
        };

        chase = () => animateSpringToTarget(this.spring, this.sig, this.targetY());

        relayout = () => {
            this.spring.target = this.targetY();
            if (!this.spring.isAnimating) this.spring.position = this.spring.target;
            this.sig.update();
        };
    }

    const tabAnimations = tabImages.map((img, i) => new TabAnimation(img, i));

    async function enterWorkView(initialIndex: number) {
        mode = "tucked";

        // elements

        const workItems: WorkItem[] = workContents.map((workContent) => ({
            textSquare: addScrollTextSquare(workContent.name.toUpperCase(), ...workContent.description),
            image1: addScrollImage(`work/${spaceToFile(workContent.name)}/1.jpg`),
            image2: addScrollImage(`work/${spaceToFile(workContent.name)}/2.jpg`),
        }));

        const nextPillarButton = addNextPillarButton("evolution");
        const scrollPadding = addScrollPadding();

        // action

        const workItemsWithTabs = workItems.map((workItem, i) => ({ workItem, tabAnimation: tabAnimations[i] }));

        const scrollToWork = (workItem: WorkItem) => {
            const major = workItem.textSquare.major;
            const q = isLandscape() ? { left: posX(major) } : { top: posY(major) - getHeaderBarHeight() };
            scrollContainer.scroll({ ...q, behavior: "smooth" });
        };

        for (const w of workItemsWithTabs) {
            w.tabAnimation.chase();
            w.tabAnimation.img.onclick = () => scrollToWork(w.workItem);
        }

        scrollContainer.addEventListener("scroll", () => {
            const closest = findWithMin(workItemsWithTabs, (w) => {
                if (isLandscape()) {
                    const center = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
                    return Math.abs(posX(w.workItem.textSquare.major) - center);
                } else {
                    const center = scrollContainer.scrollTop - scrollContainer.clientHeight / 2;
                    return Math.abs(posY(w.workItem.textSquare.major) - center);
                }
            });
            if (closest.tabAnimation.isCurrentViewed) return;

            tabAnimations.forEach((t) => t.setCurrentViewed(t === closest.tabAnimation));
        });

        // layout

        const desktopLayout = flow(
            Axis.X,
            [
                ...interlaceWithBetween(
                    workItems.map((item) =>
                        flow(Axis.X, [
                            textSquareItems(
                                item.textSquare.major,
                                (s) => ({ letterSpacing: 0.004 * s, fontWeight: 400, color: "#333333", fontSize: 0.065 * s, lineHeight: 0.05 * s }),
                                0.05,
                                item.textSquare.minors,
                                (s) => ({ letterSpacing: 0.001 * s, fontWeight: 300, color: "#333333", fontSize: 0.03 * s, lineHeight: 0.05 * s }),
                                0.02,
                                (s) => 1 * s
                            ), // -
                            gap(0.2),
                            imageWithHeight(item.image1, 1),
                            gap(0.15),
                            imageWithHeight(item.image2, 1),
                        ])
                    ),
                    gap(0.2)
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
                gap(0.1),
                ...interlaceWithBetween(
                    workItems.map((item) =>
                        flow(Axis.Y, [
                            textSquareItems(
                                item.textSquare.major,
                                (s) => ({ letterSpacing: 0.004 * s, fontWeight: 400, color: "#333333", fontSize: 0.065 * s, lineHeight: 0.05 * s }),
                                0.06,
                                item.textSquare.minors,
                                (s) => ({ letterSpacing: 0.001 * s, fontWeight: 300, color: "#333333", fontSize: 0.03 * s, lineHeight: 0.05 * s }),
                                0.02,
                                (s) => 0.85 * s
                            ), // -
                            gap(0.15),
                            imageWithWidth(item.image1, 1),
                            gap(0.06),
                            imageWithWidth(item.image2, 1),
                        ])
                    ),
                    gap(0.2)
                ),
                gap(NEXT_PILLAR_BUTTON_PAD),
                el(nextPillarButton, { style: (c) => styleNextPillarButton(nextPillarButton, c.s), align: Align.Center }),
                gap(NEXT_PILLAR_BUTTON_PAD),
                el(scrollPadding),
            ],
            { h: (c) => c.s }
        );

        await flushPageContent(); // appendChildForPage only stages elements; flush attaches them + awaits decodes
        registerUpdateLayout(() => {
            if (isLandscape()) {
                run(desktopLayout, getScrollHeight());
            } else {
                run(mobileLayout, getScrollWidth());
            }
        });

        scrollToWork(workItems[initialIndex]);
    }

    registerUpdateLayout(() => {
        if (isLandscape()) {
            resizeScrollContainerLandscape();
        } else {
            resizeScrollContainerPortrait();
        }

        run(tabsOuterBounds, 0); // s doesn't matter here
        tabAnimations.forEach((t) => t.relayout());
    });
}
