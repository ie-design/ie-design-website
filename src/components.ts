import { ieBlue } from "./constants";
import { BoxElement, MultiLineTextStyle, setSizeX, styleMultiLineText, styleSingleLineText } from "./layout";
import { Align, Axis, el, flow, gap, LayoutNode } from "./newLayoutEngine";
import { interlaceWithBetween } from "./util";

export function textSquareItems(
    major: BoxElement, // -
    majorStyle: (s: number) => MultiLineTextStyle,
    majorToMinorGap: number,
    minors: BoxElement[],
    minorStyle: (s: number) => MultiLineTextStyle,
    betweenMinorsGap: number,
    width: (s: number) => number
) {
    return flow(
        Axis.Y,
        [
            el(major, {
                style: (c) => {
                    styleMultiLineText(major, majorStyle(c.s));
                    setSizeX(major, width(c.s));
                },
            }),
            gap(majorToMinorGap),
            ...interlaceWithBetween(
                minors.map((minor) =>
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

const NEXT_PILLAR_BUTTON_PAD = 0.1;
export function footer(nextPillarButton: BoxElement, scrollPadding: BoxElement) {
    return [
        gap(NEXT_PILLAR_BUTTON_PAD),
        el(nextPillarButton, {
            style: (c) => styleSingleLineText(nextPillarButton, { letterSpacing: 0.001 * c.s, fontWeight: 400, color: ieBlue, fontSize: 0.04 * c.s }),
            align: Align.Center,
        }),
        gap(NEXT_PILLAR_BUTTON_PAD),
        el(scrollPadding),
    ];
}
