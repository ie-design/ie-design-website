import { blogs } from "./blogs/blogs";
import { body, bodySig, fadeInAnimation, gray, ieGreen } from "./constants";
import { centerElementX, centerWithGapY, isLandscape, px, styleText } from "./layout";
import { Modal } from "./modal";
import { cleanLastPage, registerUpdateLayout, shouldElementOutlastPage } from "./page";
import { addConnectPage } from "./pages/connect";
import { addEvolutionPage } from "./pages/evolution";
import { addInspirationPage } from "./pages/inspiration";
import { addViewPage, setHomeFromIntro } from "./pages/view";
import { addWorkPage } from "./pages/work";
import { addScrollSvg, centerWithinScrollY, getHeaderBarHeight, getScrollHeight, resizeScrollContainerLandscape } from "./scroll";
import { Signal, effect } from "./signal";
import { Spring, animateSpring, animateWithSpring } from "./spring";
import { createIconSVG, fetchSVG, getElementByIdSVG, makeLine, setAttributes, sleep } from "./util";

interface Page {
    addPage: () => void;
    route: string;
    sideItemsShown: boolean;
}

const pillars = {
    view: addViewPage,
    work: addWorkPage,
    evolution: addEvolutionPage,
    inspiration: addInspirationPage,
    connect: addConnectPage,
};

const routeOf = (pathSegments: string[]) => "/" + pathSegments.join("/");

const introPage = {
    addPage: () => addViewPage(),
    route: "/",
    sideItemsShown: true,
};

const pillarPages = Object.entries(pillars).map(([pageName, addPage]) => ({
    addPage,
    route: routeOf([pageName]),
    sideItemsShown: true,
}));

const blogPages = blogs.map((blog) => ({
    addPage: blog.add,
    route: routeOf(["blog", blog.slug]),
    sideItemsShown: false,
}));

const pages: Page[] = [
    introPage, //
    ...pillarPages,
    ...blogPages,
];

export class Site {
    navItems?: HTMLElement[];
    headerBar?: HTMLElement;
    menuButton?: SVGSVGElement;
    logo?: HTMLImageElement;
    copyright?: HTMLSpanElement;

    sideItemsShown = true;
    sideItemsShownSig = new Signal();

    leftAlign = () => innerHeight * 0.1;
    headerIconSize = () => getHeaderBarHeight() * 0.4;

    pushRoute = (route: string) => {
        history.pushState({}, "", import.meta.env.BASE_URL.slice(0, -1) + route);
    };

    openPage = (addPage: () => void) => {
        const page = pages.find((p) => p.addPage === addPage);
        if (!page) return;

        cleanLastPage();
        page.addPage();

        this.pushRoute(page.route);
        this.setSideItemsShown(page.sideItemsShown);

        // ZZZZ this is done poorly
        if (!this.navItems) return;
        for (const navItem of this.navItems) {
            if (page.route.includes(navItem.innerText.toLowerCase())) {
                navItem.style.color = "black";
            } else {
                navItem.style.color = gray;
            }
        }
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
            body.appendChild(navItem);

            navItems.push(navItem);
        }

        effect(() => {
            if (isLandscape()) {
                const s = getScrollHeight();
                centerWithGapY(navItems, 0.06 * s, window.innerHeight / 2);

                for (const navItem of navItems) {
                    navItem.style.visibility = "visible";
                    navItem.style.fontSize = px(s * 0.025);
                    navItem.style.left = px(this.sideItemsShown ? this.leftAlign() : -300);

                    const navItemSpan = navItem.children[0] as HTMLElement;
                    navItemSpan.style.transition = "transform 0.3s ease-out";
                    navItem.onmouseenter = () => (navItemSpan.style.transform = `translate(${0.02 * s}px, 0px)`);
                    navItem.onmouseleave = () => (navItemSpan.style.transform = "");
                }
            } else {
                for (const navItem of navItems) navItem.style.visibility = "hidden";
            }
        }, [bodySig, this.sideItemsShownSig]);
    };

    setSideItemsShown = (shown: boolean) => {
        this.sideItemsShown = shown;
        this.sideItemsShownSig.update();
        // const alignment = shown ? this.leftAlign() : -300;
        // for (const navItem of this.navItems) navItem.style.left = px(alignment);
        // if (this.copyright) this.copyright.style.left = px(alignment);
    };

    addHeaderBar = () => {
        const headerBar = document.createElement("div");
        this.headerBar = headerBar;

        headerBar.style.position = "absolute";
        headerBar.style.background = "white";
        body.appendChild(headerBar);

        effect(() => {
            headerBar.style.width = px(innerWidth);
            headerBar.style.height = px(getHeaderBarHeight());
        }, [bodySig]);
    };

    addMenuButton = () => {
        const sz = 60;
        const menuButton = createIconSVG(sz);
        this.menuButton = menuButton;

        menuButton.style.animation = fadeInAnimation();
        const menuLine = makeLine(menuButton, 4);
        const line1 = menuLine();
        const line2 = menuLine();
        const line3 = menuLine();

        const menuModal = new Modal(
            "#000000ee",
            (backdrop) => {
                const menuPageNavs: HTMLElement[] = [];
                for (const [pageName, addPage] of Object.entries(pillars)) {
                    const menuPageNav = document.createElement("span");
                    menuPageNav.style.position = "absolute";
                    menuPageNav.innerText = pageName.toUpperCase();
                    menuPageNav.style.fontFamily = "Spartan";
                    menuPageNav.style.fontWeight = "500";
                    menuPageNav.style.cursor = "pointer";

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

                menuButton.style.zIndex = "1";
            },
            (time) => {
                const s = time * sz;
                setAttributes(line1, { x1: 0, y1: 0, x2: sz, y2: s });
                line2.style.opacity = (sz - s) / sz + "";
                setAttributes(line2, { x1: 0, y1: sz / 2, x2: sz, y2: sz / 2 });
                setAttributes(line3, { x1: 0, y1: sz, x2: sz, y2: sz - s });
            },
            () => {
                menuButton.style.zIndex = "0";
            }
        );

        menuButton.style.stroke = "#bbbbbb";
        menuButton.onclick = () => {
            if (menuModal.isOpening) {
                menuButton.style.stroke = "#bbbbbb";
                menuModal.beginClose();
            } else {
                if (Modal.isAnyModalOpen) return;
                menuButton.style.stroke = gray;
                menuModal.beginOpen();
            }
        };

        body.appendChild(menuButton);

        effect(() => {
            const size = this.headerIconSize();
            menuButton.style.width = px(size);
            menuButton.style.height = px(size);
            menuButton.style.left = px(innerWidth - size - this.leftAlign());
            menuButton.style.top = px((getHeaderBarHeight() - size) / 2);
        }, [bodySig]);
    };

    addLogo = () => {
        const logo = document.createElement("img");
        this.logo = logo;

        logo.style.animation = fadeInAnimation();
        logo.style.position = "absolute";
        logo.style.cursor = "pointer";
        logo.src = "logo.svg";
        body.appendChild(logo);

        logo.onclick = async () => {
            this.openPage(pillars.view);

            const pulse = document.createElement("div");
            pulse.style.position = "absolute";
            pulse.style.background = ieGreen;
            pulse.style.pointerEvents = "none";
            body.appendChild(pulse);

            await animateWithSpring(40, (time) => {
                const out = 30;
                pulse.style.left = px(logo.offsetLeft - time * out);
                pulse.style.top = px(logo.offsetTop - time * out);
                pulse.style.width = px(logo.offsetWidth + time * 2 * out);
                pulse.style.height = px(logo.offsetHeight + time * 2 * out);
                pulse.style.opacity = 1 - time + "";
            });

            body.removeChild(pulse);
        };

        effect(() => {
            const size = this.headerIconSize();
            logo.style.width = px(size);
            logo.style.height = px(size);
            logo.style.left = px(this.leftAlign());
            logo.style.top = px((getHeaderBarHeight() - size) / 2);
        }, [bodySig]);
    };

    addCopyright = () => {
        const copyright = document.createElement("span");
        copyright.style.position = "absolute";
        copyright.innerText = "©2025 i.e. design, inc.";
        copyright.style.whiteSpace = "nowrap";
        copyright.style.transition = "left 0.4s ease";
        body.appendChild(copyright);
        this.copyright = copyright;

        effect(() => {
            if (isLandscape()) {
                copyright.style.left = px(this.sideItemsShown ? this.leftAlign() : -300);
                copyright.style.top = px(innerHeight * 0.9);
                styleText(copyright, { letterSpacing: 0.3, fontWeight: 500, color: gray, fontSize: 0.012 * innerHeight, lineHeight: 20 });
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
        body.appendChild(svg);

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
        body.removeChild(svg);
    };

    animateHomeIE = async () => {
        const home = addScrollSvg("view/home.svg");
        shouldElementOutlastPage.add(home);

        setHomeFromIntro(home);
        home.style.animation = "";

        registerUpdateLayout(() => {
            if (isLandscape()) {
                resizeScrollContainerLandscape();
                centerWithinScrollY(home, 0.95);
                home.style.left = px(0);
            }
        });

        while (home.childElementCount === 0) await new Promise(requestAnimationFrame);
        // ZZZZ this line is hacky

        const rest = getElementByIdSVG(home, "rest");
        rest.style.opacity = "0";
        const ie = getElementByIdSVG(home, "ie");
        ie.style.opacity = "0";
        await animateWithSpring(8, (time) => (ie.style.opacity = time + ""));
        await animateWithSpring(10, (time) => (rest.style.opacity = time + ""));
    };

    setup = async () => {
        const page = this.resolveRoute();
        if (page === introPage) {
            await this.animateIntro();
            await this.animateHomeIE();
        }
        this.addNavItems();

        window.addEventListener("popstate", () => {
            const page = this.resolveRoute();
            this.openPage(page.addPage);
        });

        this.addHeaderBar();
        this.addMenuButton();
        this.addLogo();
        this.addCopyright();

        this.openPage(page.addPage);
    };
}

export const site = new Site();
