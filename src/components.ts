import { BoxElement, MultiLineTextStyle, setSizeX, styleMultiLineText, styleSingleLineText } from "./layout";
import { Align, Axis, el, flow, gap } from "./newLayoutEngine";
import { TextSquare } from "./scroll";
import { contentWidthMobile } from "./site";
import { theme } from "./theme";
import { colorOnHover, interlaceWithBetween } from "./util";

export const LANDING_SVG_SCALE = 0.75;

export function link(text: string, href: string) {
    const a = document.createElement("a");
    a.style.cursor = "pointer";
    a.href = href;
    a.target = "_blank";
    a.innerText = text;
    colorOnHover(a, theme.ieBlue, theme.ieGreen);
    a.style.textDecoration = "none";
    return a;
}

export function textSquareLayout(
    textSquare: TextSquare, // -
    majorStyle: (s: number) => MultiLineTextStyle,
    majorToMinorGap: number,
    minorStyle: (s: number) => MultiLineTextStyle,
    betweenMinorsGap: number,
    width: (s: number) => number
) {
    return flow(
        Axis.Y,
        [
            el(textSquare.major, {
                style: (c) => {
                    styleMultiLineText(textSquare.major, majorStyle(c.s));
                    setSizeX(textSquare.major, width(c.s));
                },
            }),
            gap(majorToMinorGap),
            ...interlaceWithBetween(
                textSquare.minors.map((minor) =>
                    el(minor, {
                        style: (c) => {
                            styleMultiLineText(minor, minorStyle(c.s));
                            setSizeX(minor, width(c.s));
                        },
                    })
                ),
                gap(betweenMinorsGap)
            ),
        ],
        { align: Align.Center }
    );
}

export const VISUAL_ASPECT_DESKTOP = 1.13;

export const TEXT_SQUARE_WIDTH_DESKTOP = 0.79;
export const TEXT_SQUARE_GAP_DESKTOP = (VISUAL_ASPECT_DESKTOP - TEXT_SQUARE_WIDTH_DESKTOP) / 2;

export function textSquareLayoutDesktop(textSquare: TextSquare, majorTextColor: string) {
    return textSquareLayout(
        textSquare, // -
        (s) => ({ letterSpacing: 0.0046 * s, fontWeight: 400, color: majorTextColor, fontSize: 0.055 * s, lineHeight: 0.086 * s }),
        0.03,
        (s) => ({ letterSpacing: 0.0003 * s, fontWeight: 300, color: theme.bodyText, fontSize: 0.025 * s, lineHeight: 0.045 * s }),
        0.03,
        (s) => TEXT_SQUARE_WIDTH_DESKTOP * s
    );
}

export function textSquareLayoutMobile(textSquare: TextSquare, majorTextColor: string) {
    return textSquareLayout(
        textSquare,
        (s) => ({ letterSpacing: 0.003 * s, fontWeight: 400, color: majorTextColor, fontSize: 0.06 * s, lineHeight: 0.08 * s }),
        0.04,
        (s) => ({ letterSpacing: 0.001 * s, fontWeight: 300, color: theme.bodyText, fontSize: 0.028 * s, lineHeight: 0.05 * s }),
        0.04,
        (s) => contentWidthMobile()
    );
}

export function startGapDesktop() {
    return gap(0.2);
}

export function startGapMobile() {
    return gap(0.1);
}

const NEXT_PILLAR_BUTTON_PAD = 0.1;
export function footer(nextPillarButton: BoxElement, scrollPadding: BoxElement) {
    return [
        gap(NEXT_PILLAR_BUTTON_PAD),
        el(nextPillarButton, {
            style: (c) => styleSingleLineText(nextPillarButton, { letterSpacing: 0.001 * c.s, fontWeight: 400, color: theme.ieBlue, fontSize: 0.025 * c.s }),
            align: Align.Center,
        }),
        gap(NEXT_PILLAR_BUTTON_PAD),
        el(scrollPadding),
    ];
}
