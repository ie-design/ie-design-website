import { growingTheDreamBlog } from "./blogs/11-growing-the-dream";
import { body, bodySig, fadeInAnimation, gray, ieGreen } from "./constants";
import { centerElementX, centerWithGapY, isLandscape, px, styleText } from "./layout";
import { Modal } from "./modal";
import { cleanLastPage, registerUpdateLayout } from "./page";
import { addConnectPage } from "./pages/connect";
import { addEvolutionPage } from "./pages/evolution";
import { addInspirationPage } from "./pages/inspiration";
import { addViewPage } from "./pages/view";
import { addWorkPage } from "./pages/work";
import { addScrollSvg, centerWithinScrollY, getHeaderBarHeight, getScrollHeight, resizeScrollContainerLandscape } from "./scroll";
import { Signal, effect } from "./signal";
import { Spring, animateSpring, animateWithSpring } from "./spring";
import { colorOnHover, createIconSVG, fetchSVG, getElementByIdSVG, makeLine, setAttributes, sleep } from "./util";

const pages = {
    view: addViewPage,
    work: addWorkPage,
    inspiration: addInspirationPage,
    evolution: addEvolutionPage,
    connect: addConnectPage,
};

const navItemFromString: Record<string, HTMLElement> = {};

const edgeAlignX = () => innerHeight * 0.1;
const headerIconSize = () => getHeaderBarHeight() * 0.4;

async function animateIntro() {
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
}

function addNavItems() {
    for (const [pageName, addPage] of Object.entries(pages)) {
        const navItem = document.createElement("span");
        navItem.innerText = pageName.toUpperCase();

        navItem.style.animation = fadeInAnimation();
        navItem.style.position = "absolute";
        navItem.style.fontFamily = "Spartan";
        navItem.style.color = gray;
        navItem.style.fontWeight = "500";
        navItem.style.cursor = "pointer";
        navItem.style.whiteSpace = "nowrap";

        navItem.onclick = () => {
            cleanLastPage();
            addPage();
            navItem.style.color = "#000000";
            // pageCleanups.add(() => (navItem.style.color = gray));
            // history.pushState({}, "", "/#/" + pageName);
        };

        body.appendChild(navItem);

        navItemFromString[pageName] = navItem;

        const hoverSpring = new Spring(0);
        const hoverSpringSig = new Signal();
        hoverSpring.setStiffnessCritical(400);
        effect(() => {
            navItem.style.left = px(edgeAlignX() + hoverSpring.position * 10);
        }, [hoverSpringSig, bodySig]);

        navItem.onmouseenter = () => {
            hoverSpring.target = 1;
            animateSpring(hoverSpring, hoverSpringSig);
        };

        navItem.onmouseleave = () => {
            hoverSpring.target = 0;
            animateSpring(hoverSpring, hoverSpringSig);
        };
    }

    const navItems = Object.values(navItemFromString);

    effect(() => {
        if (isLandscape()) {
            const s = getScrollHeight();

            centerWithGapY(navItems, 0.06 * s, window.innerHeight / 2);

            for (const navItem of navItems) {
                // navItem.style.left = px(edgeAlignX());
                navItem.style.visibility = "visible";
                navItem.style.fontSize = px(s * 0.025);
            }
        } else {
            for (const navItem of navItems) navItem.style.visibility = "hidden";
        }
    }, [bodySig]);
}

function addHeaderBar() {
    const headerBar = document.createElement("div");
    headerBar.style.position = "absolute";
    headerBar.style.background = "white";

    body.appendChild(headerBar);

    effect(() => {
        headerBar.style.width = px(innerWidth);
        headerBar.style.height = px(getHeaderBarHeight());
    }, [bodySig]);
}

function addMenuButton() {
    const sz = 60;
    const menuButton = createIconSVG(sz);
    menuButton.style.animation = fadeInAnimation();
    const menuLine = makeLine(menuButton, 4);
    const line1 = menuLine();
    const line2 = menuLine();
    const line3 = menuLine();

    const menuModal = new Modal(
        "#000000ee",
        (backdrop) => {
            const menuPageNavs: HTMLElement[] = [];
            for (const [pageName, navItem] of Object.entries(navItemFromString)) {
                const menuPageNav = document.createElement("span");
                menuPageNav.style.position = "absolute";
                menuPageNav.innerText = pageName.toUpperCase();
                menuPageNav.style.fontFamily = "Spartan";
                menuPageNav.style.fontWeight = "500";
                menuPageNav.style.cursor = "pointer";
                colorOnHover(menuPageNav, gray, "white");

                menuPageNav.onclick = () => {
                    menuModal.beginClose();
                    navItem.click();
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
            menuButton.style.stroke = gray;
            menuModal.beginOpen();
        }
    };

    body.appendChild(menuButton);

    effect(() => {
        const size = headerIconSize();
        menuButton.style.width = px(size);
        menuButton.style.height = px(size);

        menuButton.style.left = px(innerWidth - size - edgeAlignX());
        menuButton.style.top = px((getHeaderBarHeight() - size) / 2);
    }, [bodySig]);
}

function addLogo() {
    const logo = document.createElement("img");
    logo.style.animation = fadeInAnimation();
    logo.style.position = "absolute";
    logo.style.cursor = "pointer";
    logo.src = "logo.svg";
    body.appendChild(logo);

    logo.onclick = async () => {
        navItemFromString.view.click();

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
        const size = headerIconSize();
        logo.style.width = px(size);
        logo.style.height = px(size);

        logo.style.left = px(edgeAlignX());
        logo.style.top = px((getHeaderBarHeight() - size) / 2);
    }, [bodySig]);
}

function addCopyright() {
    const copyright = document.createElement("span");
    copyright.style.position = "absolute";
    copyright.innerText = "©2025 i.e. design, inc.";
    copyright.style.whiteSpace = "nowrap";

    body.appendChild(copyright);

    effect(() => {
        if (isLandscape()) {
            copyright.style.left = px(edgeAlignX());
            copyright.style.top = px(innerHeight * 0.9);
            styleText(copyright, { letterSpacing: 0.3, fontWeight: 500, color: gray, fontSize: 0.012 * innerHeight, lineHeight: 20 });
            copyright.style.visibility = "visible";
        } else {
            // ZZZZ need to do something here
            copyright.style.visibility = "hidden";
        }
    }, [bodySig]);
}
async function animateHomeIE() {
    const homeSvg = addScrollSvg("view/home.svg");
    homeSvg.style.animation = "";

    registerUpdateLayout(() => {
        if (isLandscape()) {
            resizeScrollContainerLandscape();

            centerWithinScrollY(homeSvg, 0.95);
            homeSvg.style.left = px(0);
        }
    });

    while (homeSvg.childElementCount === 0) await new Promise(requestAnimationFrame);
    // ZZZZ this line is hacky

    const rest = getElementByIdSVG(homeSvg, "rest");
    rest.style.opacity = "0";
    const ie = getElementByIdSVG(homeSvg, "ie");
    ie.style.opacity = "0";
    await animateWithSpring(8, (time) => (ie.style.opacity = time + ""));
    await animateWithSpring(10, (time) => (rest.style.opacity = time + ""));
}

async function setup() {
    // const pageName = location.hash.substring("#/".length);

    // await animateIntro();
    // await animateHomeIE();

    addNavItems();
    addHeaderBar();
    addMenuButton();
    addLogo();
    // addCopyright();

    // const pageNavItem = navItemFromString[pageName] ?? navItemFromString.view;
    // addViewPage();
    growingTheDreamBlog.add();
}

setup();
