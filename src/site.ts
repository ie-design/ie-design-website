import { blogs } from "./blogs/blogs";
import { startGapDesktop, startGapMobile } from "./components";
import { BoxElement, isLandscape, px, sizeX, sizeY, styleSingleLineText } from "./layout";
import { MODAL_ZINDEX, Modal } from "./modal";
import { Align, Axis, flow, imageByWidth, imageWithHeight, run } from "./newLayoutEngine";
import { bodySig, cleanLastPage, fadeInAnimation, registerUpdateLayout, shouldElementOutlastPage } from "./page";
import { addConnectPage } from "./pages/connect";
import { addEvolutionPage } from "./pages/evolution";
import { addInspirationPage } from "./pages/inspiration";
import { addNewHomeScrollSvgs, addViewPage, justHomeLayoutDesktop, justHomeLayoutMobile, setHomeFromIntro } from "./pages/view";
import { addWorkPage } from "./pages/work";
import { getHeaderBarHeight, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait } from "./scroll";
import { Signal, effect } from "./signal";
import { Spring, animateSpring, animateWithSpring } from "./spring";
import { setupLogoThemeToggle, theme } from "./theme";
import { colorOnHover, colorOnHoverSVGStroke, createElementSVG, createIconSVG, fetchSVG, getElementByIdSVG, interlaceWithBetween, loadSVGInto, makeLine, makePolyline, setAttributes, setPolylines, sleep } from "./util";

interface Page {
    addPage: () => void;
    route: string;
    sideItemsShown: boolean;
}

export const pillars = {
    view: addViewPage,
    work: addWorkPage,
    inspiration: addInspirationPage,
    evolution: addEvolutionPage,
    connect: addConnectPage,
};

const routeOf = (pathSegments: string[]) => "/" + pathSegments.join("/");

const introPage = {
    addPage: () => addViewPage(),
    route: routeOf([]),
    sideItemsShown: true,
};

const pillarPages = Object.entries(pillars).map(([pageName, addPage]) => ({
    addPage,
    route: routeOf([pageName]),
    sideItemsShown: true,
}));

const blogPages = blogs.map((blog) => ({
    addPage: blog.add,
    route: routeOf(["blog", blog.name]),
    sideItemsShown: false,
}));

const pages: Page[] = [
    introPage, //
    ...pillarPages,
    ...blogPages,
];

export const leftEdgeItemAlignment = () => (isLandscape() ? innerHeight * 0.1 : innerWidth * 0.07);
export const contentWidthMobile = () => innerWidth - leftEdgeItemAlignment() * 2;

export class Site {
    navItems?: HTMLElement[];
    headerBar?: HTMLElement;
    menuButton?: SVGSVGElement;
    logo?: SVGSVGElement;
    copyright?: HTMLSpanElement;

    sideItemsShown = true;
    sideItemsShownSig = new Signal();

    pushRoute = (route: string) => {
        history.pushState({}, "", import.meta.env.BASE_URL.slice(0, -1) + route);
    };

    loadPage = (addPage: () => void) => {
        const page = pages.find((p) => p.addPage === addPage);
        if (!page) return;

        if (this.imageModal?.wasLastOpened) this.imageModal.beginClose();
        if (this.menuModal?.wasLastOpened) this.menuModal.beginClose();
        cleanLastPage();
        page.addPage();

        this.setSideItemsShown(page.sideItemsShown);

        // ZZZZ this is still done poorly
        if (!this.navItems) return;
        for (const navItem of this.navItems) colorOnHover(navItem, theme.neutral, theme.bodyText);
        const currentNavItem = this.navItems[pillarPages.findIndex((p) => p.addPage === addPage)];
        if (!currentNavItem) return;
        colorOnHover(currentNavItem, theme.bodyText, theme.bodyText);
    };

    openPage = (addPage: () => void) => {
        const page = pages.find((p) => p.addPage === addPage);
        if (!page) return;
        this.pushRoute(page.route);
        this.loadPage(addPage);
    };

    addNavItems = () => {
        const navItems: HTMLElement[] = [];
        this.navItems = navItems;

        for (const [pageName, addPage] of Object.entries(pillars)) {
            const navItem = document.createElement("div");
            navItem.style.position = "absolute";
            navItem.style.animation = fadeInAnimation();
            navItem.style.cursor = "pointer";
            navItem.style.transition = "left 0.4s ease";

            const navItemSpan = document.createElement("span");
            navItemSpan.style.display = "inline-block";
            navItemSpan.innerText = pageName.toUpperCase();
            navItemSpan.style.fontFamily = "Spartan";
            navItemSpan.style.fontWeight = "500";
            navItemSpan.style.whiteSpace = "nowrap";

            navItem.onclick = () => {
                this.openPage(addPage);
            };

            navItem.appendChild(navItemSpan);
            document.body.appendChild(navItem);

            navItems.push(navItem);
        }

        effect(() => {
            if (isLandscape()) {
                const s = getScrollHeight();
                centerWithGapY(navItems, 0.06 * s, window.innerHeight / 2);

                for (const navItem of navItems) {
                    navItem.style.visibility = "visible";
                    navItem.style.fontSize = px(s * 0.025);
                    navItem.style.left = px(this.sideItemsShown ? leftEdgeItemAlignment() : -300);

                    const navItemSpan = navItem.children[0] as HTMLElement;
                    navItemSpan.style.transition = "transform 0.3s ease-out";
                    navItem.addEventListener("pointerenter", () => (navItemSpan.style.transform = `translate(${0.02 * s}px, 0px)`));
                    navItem.addEventListener("pointerleave", () => (navItemSpan.style.transform = ""));
                }
            } else {
                for (const navItem of navItems) navItem.style.visibility = "hidden";
            }
        }, [bodySig, this.sideItemsShownSig]);
    };

    setSideItemsShown = (shown: boolean) => {
        this.sideItemsShown = shown;
        this.sideItemsShownSig.update();
        // const alignment = shown ? leftEdgeItemAlignment() : -300;
        // for (const navItem of this.navItems) navItem.style.left = px(alignment);
        // if (this.copyright) this.copyright.style.left = px(alignment);
    };

    addHeaderBar = () => {
        const headerBar = document.createElement("div");
        this.headerBar = headerBar;

        headerBar.style.position = "absolute";
        headerBar.style.background = theme.background;
        document.body.appendChild(headerBar);

        effect(() => {
            headerBar.style.width = px(innerWidth);
            headerBar.style.height = px(getHeaderBarHeight());
        }, [bodySig]);
    };

    addMenuButton = () => {
        const sz = 70;
        const menuButton = createIconSVG(sz);
        this.menuButton = menuButton;

        menuButton.style.animation = fadeInAnimation();
        colorOnHoverSVGStroke(menuButton, theme.neutral, theme.neutralFront);

        const menuLine = makeLine(menuButton, 4);
        const line1 = menuLine();
        const line2 = menuLine();
        const line3 = menuLine();

        const menuModal = new Modal(
            theme.menuModalOverlay,
            (time) => {
                const s = time * sz;
                setAttributes(line1, { x1: 0, y1: 0, x2: sz, y2: s });
                line2.style.opacity = (sz - s) / sz + "";
                setAttributes(line2, { x1: 0, y1: sz / 2, x2: sz, y2: sz / 2 });
                setAttributes(line3, { x1: 0, y1: sz, x2: sz, y2: sz - s });
            },
            {
                onBeginOpen: (backdrop) => {
                    const menuPageNavs: HTMLElement[] = [];
                    for (const [pageName, addPage] of Object.entries(pillars)) {
                        const menuPageNav = document.createElement("span");
                        menuPageNav.style.position = "absolute";
                        menuPageNav.innerText = pageName.toUpperCase();
                        menuPageNav.style.fontFamily = "Spartan";
                        menuPageNav.style.fontWeight = "500";
                        menuPageNav.style.cursor = "pointer";
                        colorOnHover(menuPageNav, theme.neutralFront, theme.background);

                        menuPageNav.onclick = () => {
                            menuModal.beginClose();
                            this.openPage(addPage);
                        };

                        backdrop.appendChild(menuPageNav);
                        menuPageNavs.push(menuPageNav);
                    }

                    menuModal.onLayout = () => {
                        for (const menuPageNav of menuPageNavs) {
                            menuPageNav.style.fontSize = px(innerHeight * 0.05);
                            centerElementX(menuPageNav);
                        }
                        centerWithGapY(menuPageNavs, innerHeight * 0.08, innerHeight / 2);
                    };

                    menuButton.style.zIndex = MODAL_ZINDEX + 1 + "";
                },
                onTriggerOpen: () => {
                    colorOnHoverSVGStroke(menuButton, theme.neutralFront, theme.background);
                },
                onTriggerClose: () => {
                    colorOnHoverSVGStroke(menuButton, theme.neutralFront, theme.neutralFront);
                },
                onEndClose: () => {
                    menuButton.style.zIndex = "0";
                },
            }
        );

        menuButton.onclick = () => {
            if (menuModal.wasLastOpened) {
                menuModal.beginClose();
            } else {
                if (Modal.isAnyModalOpen) return;
                menuModal.beginOpen();
            }
        };

        document.body.appendChild(menuButton);

        effect(() => {
            if (isLandscape()) {
                const size = getHeaderBarHeight() * 0.3;
                menuButton.style.width = px(size);
                menuButton.style.height = px(size);
                menuButton.style.left = px(innerWidth - size - leftEdgeItemAlignment());
                menuButton.style.top = px((getHeaderBarHeight() - size) / 2);
            } else {
                const size = getHeaderBarHeight() * 0.4;
                const gapToEdge = (getHeaderBarHeight() - size) / 2;
                menuButton.style.width = px(size);
                menuButton.style.height = px(size);
                menuButton.style.left = px(innerWidth - size - gapToEdge);
                menuButton.style.top = px(gapToEdge);
            }
        }, [bodySig]);
    };

    addLogo = () => {
        const logo = createElementSVG("svg");
        this.logo = logo;

        logo.style.animation = fadeInAnimation();
        logo.style.position = "absolute";
        logo.style.cursor = "pointer";
        loadSVGInto(logo, "logo.svg");
        document.body.appendChild(logo);
        setupLogoThemeToggle(logo);

        logo.onclick = async () => {
            this.openPage(pillars.view);

            const pulse = document.createElement("div");
            pulse.style.position = "absolute";
            pulse.style.background = theme.ieGreen;
            pulse.style.pointerEvents = "none";
            document.body.appendChild(pulse);

            await animateWithSpring(40, (time) => {
                const out = 30;
                const l = logo.getBoundingClientRect();
                pulse.style.left = px(l.left - time * out);
                pulse.style.top = px(l.top - time * out);
                pulse.style.width = px(l.width + time * 2 * out);
                pulse.style.height = px(l.height + time * 2 * out);
                pulse.style.opacity = 1 - time + "";
            });

            document.body.removeChild(pulse);
        };

        effect(() => {
            if (isLandscape()) {
                const size = getHeaderBarHeight() * 0.45;
                logo.style.width = px(size);
                logo.style.height = px(size);
                logo.style.left = px(leftEdgeItemAlignment());
                logo.style.top = px((getHeaderBarHeight() - size) / 2);
            } else {
                const size = getHeaderBarHeight() * 0.5;
                logo.style.width = px(size);
                logo.style.height = px(size);
                logo.style.left = px(leftEdgeItemAlignment());
                logo.style.top = px((getHeaderBarHeight() - size) / 2);
            }
        }, [bodySig]);
    };

    addCopyright = () => {
        const copyright = document.createElement("span");
        copyright.style.position = "absolute";
        copyright.innerText = "©2026 i.e. design, inc.";
        copyright.style.whiteSpace = "nowrap";
        copyright.style.transition = "left 0.4s ease";
        document.body.appendChild(copyright);
        this.copyright = copyright;

        effect(() => {
            if (isLandscape()) {
                copyright.style.left = px(this.sideItemsShown ? leftEdgeItemAlignment() : -300);
                copyright.style.top = px(innerHeight * 0.95);
                styleSingleLineText(copyright, { letterSpacing: 0.3, fontWeight: 500, color: theme.neutral, fontSize: 0.012 * innerHeight });
                copyright.style.visibility = "visible";
            } else {
                // ZZZZ need to do something here
                copyright.style.visibility = "hidden";
            }
        }, [bodySig, this.sideItemsShownSig]);
    };

    resolveRoute = () => {
        const base = import.meta.env.BASE_URL.slice(0, -1);
        let pathname = window.location.pathname;
        if (base) pathname = pathname.startsWith(base) ? pathname.slice(base.length) || "/" : "/";
        const segments = pathname.substring(1).split("/").filter(Boolean);

        const route = routeOf(segments);
        const node = pages.find((p) => p.route === route);

        return node ? node : introPage;
    };

    animateIntro = async () => {
        // ZZZZ clean this up
        const svg = await fetchSVG("logo-full.svg");
        svg.style.position = "absolute";
        svg.style.opacity = "0";
        document.body.appendChild(svg);

        svg.style.height = px(innerHeight * 0.4);

        await sleep(1000);

        const svgSpring = new Spring(0);
        svgSpring.setStiffnessCritical(80);
        const svgSpringSig = new Signal();

        effect(() => {
            svg.style.opacity = "" + svgSpring.position;
            svg.style.height = px((1.3 - svgSpring.position) * innerHeight);
            svg.style.top = px((innerHeight - svg.scrollHeight) / 2);
            svg.style.left = px((innerWidth - svg.scrollWidth) / 2);
        }, [svgSpringSig]);

        svgSpring.target = 1;
        animateSpring(svgSpring, svgSpringSig);

        await sleep(1000);
        const d = "design";

        function opacityOut(element: SVGElement) {
            const letterSpring = new Spring(1);
            letterSpring.setStiffnessCritical(150);
            const letterSpringSig = new Signal();

            effect(() => {
                element.style.opacity = "" + letterSpring.position;
            }, [letterSpringSig]);

            letterSpring.target = 0;
            animateSpring(letterSpring, letterSpringSig);
        }
        for (let i = 0; i < d.length; i++) {
            const designLetter = getElementByIdSVG(svg, "design-" + d[i]);
            opacityOut(designLetter);
            await sleep(120);
        }
        const l = ["big-i", "dot-1", "big-e", "dot-2"];
        for (let i = 0; i < l.length; i++) {
            const designLetter = getElementByIdSVG(svg, l[i]);
            opacityOut(designLetter);
            await sleep(120);
        }
        await sleep(1000);

        svgSpring.target = 0;
        animateSpring(svgSpring, svgSpringSig);

        await sleep(500);
        document.body.removeChild(svg);
    };

    animateHomeIE = async () => {
        const home = addNewHomeScrollSvgs();
        for (const el of home) {
            shouldElementOutlastPage.add(el);
            el.style.animation = "";
        }
        setHomeFromIntro(home);

        const [homeDesktop, homeMobile] = home;

        const desktopLayout = flow(Axis.X, justHomeLayoutDesktop(homeDesktop), { h: (c) => c.s });
        const mobileLayout = flow(Axis.Y, justHomeLayoutMobile(homeMobile), { w: (c) => c.s });

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

        for (const el of home) while (el.childElementCount === 0) await new Promise(requestAnimationFrame);
        // ZZZZ this line is hacky

        await Promise.all(
            home.map(async (el) => {
                const rest = getElementByIdSVG(el, "rest");
                rest.style.opacity = "0";
                const ie = getElementByIdSVG(el, "ie");
                ie.style.opacity = "0";
                await animateWithSpring(8, (time) => (ie.style.opacity = time + ""));
                await animateWithSpring(10, (time) => (rest.style.opacity = time + ""));
            })
        );
    };

    bigImage?: HTMLImageElement;
    imageModal?: Modal;
    menuModal?: Modal;

    addImageModal = () => {
        const sz = 60;

        const exitButton = createIconSVG(sz);
        const makeExitLine = makeLine(exitButton, 12);
        setAttributes(makeExitLine(), { x1: 0, y1: 0, x2: sz, y2: sz });
        setAttributes(makeExitLine(), { x1: 0, y1: sz, x2: sz, y2: 0 });
        colorOnHoverSVGStroke(exitButton, theme.neutralFront, theme.ieBlue);

        const fullscreenButton = createIconSVG(sz);
        const makeFullscreenPolyline = makePolyline(fullscreenButton, 12);
        const ab = sz / 3;
        const ba = sz - ab;
        setPolylines(
            makeFullscreenPolyline,
            [
                [ab, 0],
                [0, 0],
                [0, ab],
            ],
            [
                [0, ba],
                [0, sz],
                [ab, sz],
            ],
            [
                [ba, sz],
                [sz, sz],
                [sz, ba],
            ],
            [
                [sz, ab],
                [sz, 0],
                [ba, 0],
            ]
        );
        colorOnHoverSVGStroke(fullscreenButton, theme.neutralFront, theme.ieBlue);

        const bigImage = document.createElement("img");
        this.bigImage = bigImage;
        bigImage.style.position = "absolute";
        bigImage.style.filter = `drop-shadow(0px 0px 15px ${theme.neutralFront})`;

        const imageModal = new Modal(
            theme.imageModalOverlay,
            (time) => {
                bigImage.style.opacity = time + "";
            },
            {
                onBeginOpen: (backdrop) => {
                    if (Modal.isAnyModalOpen) return;

                    backdrop.appendChild(bigImage);
                    backdrop.appendChild(exitButton);
                    backdrop.appendChild(fullscreenButton);

                    exitButton.onclick = imageModal.beginClose;
                    fullscreenButton.onclick = () => bigImage.requestFullscreen();

                    imageModal.onLayout = () => {
                        const size = 15;
                        const fromEdge = 15;

                        exitButton.style.width = px(size);
                        exitButton.style.height = px(size);
                        exitButton.style.left = px(innerWidth - size - fromEdge);
                        exitButton.style.top = px(fromEdge);

                        fullscreenButton.style.width = px(size);
                        fullscreenButton.style.height = px(size);
                        fullscreenButton.style.left = px(innerWidth - size - fromEdge - size * 2);
                        fullscreenButton.style.top = px(fromEdge);

                        setImageHeight(bigImage, innerHeight * 0.9);
                        if (bigImage.offsetWidth > innerWidth * 0.9) {
                            setImageWidth(bigImage, innerWidth * 0.9);
                        }
                        centerElementX(bigImage);
                        centerElementY(bigImage);
                    };
                },
                onTriggerOpen: () => {},
                onTriggerClose: () => {},
                onEndClose: () => {},
            }
        );
        this.imageModal = imageModal;
    };

    openImage = async (src: string) => {
        const bigImage = this.bigImage;
        if (!bigImage) return;

        bigImage.src = src;
        await bigImage.decode();
        this.imageModal?.beginOpen();
    };

    setup = async () => {
        const page = this.resolveRoute();
        let addPage = page.addPage;
        if (page === introPage) {
            await this.animateIntro();
            await this.animateHomeIE();
            addPage = addViewPage;
        }
        this.addNavItems();

        window.addEventListener("popstate", () => {
            const page = this.resolveRoute();
            this.loadPage(page.addPage);
        });

        this.addImageModal();
        this.addHeaderBar();
        this.addMenuButton();
        this.addLogo();
        this.addCopyright();

        this.openPage(addPage);
    };
}

export const site = new Site();

// ZZZZ these will later be removed in favor of new layout system

interface ElementAlignment {
    element: BoxElement;
    offset: number;
}

type LayoutItem = BoxElement | BoxElement[] | number;

function centerElementX(element: HTMLElement) {
    element.style.left = px(innerWidth / 2 - sizeX(element) / 2);
}

function centerElementY(element: HTMLElement) {
    element.style.top = px(innerHeight / 2 - sizeY(element) / 2);
}

export function setImageWidth(image: HTMLImageElement, width: number) {
    image.style.width = px(width);
    image.style.height = px((width / image.naturalWidth) * image.naturalHeight);
}

export function setImageHeight(image: HTMLImageElement, height: number) {
    image.style.height = px(height);
    image.style.width = px((height / image.naturalHeight) * image.naturalWidth);
}

function axisAligningWithGaps(axisSize: (element: BoxElement) => number) {
    return (elementsOrGaps: LayoutItem[]): [ElementAlignment[], number] => {
        const elementAlignments: ElementAlignment[] = [];
        let runningTotal = 0;
        for (const item of elementsOrGaps) {
            if (Array.isArray(item)) {
                for (const element of item) elementAlignments.push({ element, offset: runningTotal });
                runningTotal += Math.max(...item.map(axisSize));
            } else if (item instanceof HTMLElement || item instanceof SVGSVGElement) {
                elementAlignments.push({ element: item, offset: runningTotal });
                runningTotal += axisSize(item);
            } else {
                runningTotal += item;
            }
        }
        return [elementAlignments, runningTotal];
    };
}

const aligningWithGapsY = axisAligningWithGaps(sizeY);
function centerWithGapY(elements: HTMLElement[], gap: number, center: number) {
    const elementsWithGaps = interlaceWithBetween(elements, gap);
    const [elementAlignments, totalHeight] = aligningWithGapsY(elementsWithGaps);

    for (const { element, offset } of elementAlignments) {
        element.style.top = px(offset + center - totalHeight / 2);
    }
}
