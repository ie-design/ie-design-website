import { footer } from "../components";
import { isLandscape, styleMultiLineText, styleSingleLineText } from "../layout";
import { Align, anchored, Axis, el, flow, gap, imageWithFillWidth, imageWithWidth, run, setSizeX, setSizeY } from "../newLayoutEngine";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollPadding, addScrollSvg, addScrollText, getScrollHeight, getScrollWidth, resizeScrollContainerLandscape, resizeScrollContainerPortrait } from "../scroll";
import { theme } from "../theme";
import { appendParagraph, colorOnHoverSVGFill, interlaceWithBetween, link } from "../util";

function addIcon(imageSrc: string, clickLink: string) {
    const icon = addScrollSvg(imageSrc);
    icon.style.cursor = "pointer";
    colorOnHoverSVGFill(icon, theme.neutralFront, theme.ieGreen);
    icon.onclick = () => window.open(clickLink);
    return icon;
}

function iconSquare(icon: SVGSVGElement) {
    return el(icon, {
        style: (c) => {
            setSizeX(icon, 0.055 * c.s);
            setSizeY(icon, 0.055 * c.s);
        },
    });
}

export function addConnectPage() {
    const connect = addScrollSvg("connect/connect.svg");
    const letsMeet = addScrollImage("connect/lets-meet.jpg");
    const who = addScrollText("Bethlyn Krakauer, Founder and Creative Director");
    const texts = [
        addScrollText("Our clients look to us for more than award-winning design. They value our role as trusted advisor, support, and confidant."), // -
        addScrollText("We look for synergy and compatibility in every relationship we build so the work experience doesn’t feel like work at all."),
        appendParagraph(addScrollText(""), "If your gut is telling you we should connect, now is the perfect time to ", link("email", "mailto:beth@ie-design.com"), "."),
    ];
    const icons = [
        addIcon("connect/instagram-icon.svg", "https://www.instagram.com/iedesigninc"), // -
        addIcon("connect/linkedin-icon.svg", "https://www.linkedin.com/company/i-e-design-inc"),
        addIcon("connect/mail-icon.svg", "mailto:beth@ie-design.com"),
    ];
    const scrollPadding = addScrollPadding();

    const desktopTextStyle = (s: number) => ({ letterSpacing: 0, fontWeight: 300, color: theme.bodyText, fontSize: 0.025 * s });
    const desktopLayout = flow(
        Axis.X,
        [
            flow(
                Axis.Y,
                [
                    imageWithWidth(connect, 0.55), // -
                    gap(0.09),
                    ...interlaceWithBetween(
                        texts.map((t) =>
                            el(t, {
                                style: (c) => {
                                    styleMultiLineText(t, { ...desktopTextStyle(c.s), lineHeight: 0.05 * c.s });
                                    setSizeX(t, 0.55 * c.s);
                                },
                                align: Align.Center,
                            })
                        ),
                        gap(0.03)
                    ),
                    gap(0.04),
                    flow(Axis.X, interlaceWithBetween(icons.map(iconSquare), gap(0.03))),
                ],
                { place: (self, s) => (self.y = 0.05 * s) }
            ),
            gap(0.15),
            anchored(
                Axis.Y,
                [
                    el(letsMeet, { style: (c) => setSizeY(letsMeet, 0.8 * c.s), anchor: true }), // -
                    gap(0.04),
                    el(who, { style: (c) => styleSingleLineText(who, desktopTextStyle(c.s)) }),
                ],
                { h: (c) => c.s }
            ),
            ...footer(document.createElement("div"), scrollPadding), // - silly way of saying don't
        ],
        { h: (c) => c.s }
    );

    const mobileTextStyle = (s: number) => ({ letterSpacing: 0, fontWeight: 300, color: theme.bodyText, fontSize: 0.024 * s });
    const mobileLayout = flow(
        Axis.Y,
        [
            imageWithWidth(connect, 0.8), // -
            gap(0.09),
            imageWithFillWidth(letsMeet),
            gap(0.05),
            flow(
                Axis.Y,
                [
                    el(who, { style: (c) => styleSingleLineText(who, mobileTextStyle(c.s)) }),
                    gap(0.1),
                    ...interlaceWithBetween(
                        texts.map((t) =>
                            el(t, {
                                style: (c) => {
                                    styleMultiLineText(t, { lineHeight: 0.04 * c.s, ...mobileTextStyle(c.s) });
                                    setSizeX(t, c.parent.w);
                                },
                            })
                        ),
                        gap(0.03)
                    ),
                    gap(0.04),
                    flow(Axis.X, interlaceWithBetween(icons.map(iconSquare), gap(0.03))),
                ],
                { w: (c) => 0.9 * c.s, align: Align.Center }
            ),
            ...footer(document.createElement("div"), scrollPadding), // - silly way of saying don't
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
