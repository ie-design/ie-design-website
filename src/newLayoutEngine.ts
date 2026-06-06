import { BoxElement, px, setSizeX, setSizeY, sizeX, sizeY } from "./layout";

// A small two-pass layout engine over "virtual boxes".
//
//  1. resolve   (size)      — definite sizes flow top-down; intrinsic/content sizes flow bottom-up.
//  2. position  (skeleton)  — containers place children via a flow or anchored strategy, top-down.
//  3. place     (overrides) — sibling-relative placements, top-down, reading already-resolved boxes.
//  4. sync                  — write each bound element's box (left/top) to the DOM.
//
// Every node owns a live `box` object. Because boxes are referenced, not copied,
// a `place` callback can read another node's resolved geometry directly.

export enum Axis {
    X,
    Y,
}

export enum Align {
    Start,
    Center,
    End,
}

export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Ctx {
    s: number; // global scalar (scroll height/width) for absolute scaling
    parent: Box; // containing block, for percent-of-parent sizing
}

export interface LayoutNode {
    // binding
    el?: BoxElement; // omit for a purely virtual box
    box: Box; // resolved geometry (live; referenced by place callbacks)

    // sizing
    style?: (ctx: Ctx) => void; // apply styling + driven size; leaves then measure both axes from the DOM
    w?: (ctx: Ctx) => number; // explicit width override (definite; percent-of-parent via ctx.parent)
    h?: (ctx: Ctx) => number; // explicit height override

    // container
    dir?: Axis; // marks this node a flow container along dir
    children?: LayoutNode[];
    anchored?: boolean; // place the anchor child centered, others before/after it

    // placement within parent
    align?: Align; // cross-axis alignment in parent flow (default Start)
    alignAlongFlow?: Align; // main-axis alignment in parent flow (default Start); container must have explicit main-axis size
    spacer?: number; // pure gap: advances parent main axis by spacer * s, no element
    anchor?: boolean; // this child is the base box of an anchored container
    float?: boolean; // skipped by flow accumulation; positioned only via place()

    // escape hatches
    place?: (self: Box, s: number) => void; // relative override, runs after the skeleton is positioned
    post?: () => void; // after DOM sync (e.g. getClientRects fixups)
}

type Opts = Omit<Partial<LayoutNode>, "box">;

function mk(opts: Opts): LayoutNode {
    return { ...opts, box: { x: 0, y: 0, w: 0, h: 0 } };
}

export function el(element: BoxElement, opts: Opts = {}): LayoutNode {
    return mk({ el: element, ...opts });
}

export function flow(dir: Axis, children: LayoutNode[], opts: Opts = {}): LayoutNode {
    return mk({ dir, children, ...opts });
}

export function anchored(dir: Axis, children: LayoutNode[], opts: Opts = {}): LayoutNode {
    return mk({ dir, children, anchored: true, ...opts });
}

export function virtual(opts: Opts = {}): LayoutNode {
    return mk(opts);
}

export function gap(fraction: number): LayoutNode {
    return mk({ spacer: fraction });
}

function aspectRatio(image: BoxElement): number {
    if (image instanceof SVGSVGElement) {
        const vb = image.viewBox.baseVal;
        return vb.width / vb.height;
    }
    if (image instanceof HTMLImageElement) return image.naturalWidth / image.naturalHeight;
    return 1;
}

export function imageByWidth(image: BoxElement, getW: (c: Ctx) => number, opts: Opts = {}): LayoutNode {
    return el(image, {
        style: (c) => {
            const w = getW(c);
            setSizeX(image, w);
            setSizeY(image, w / aspectRatio(image));
        },
        ...opts,
    });
}

export function imageByHeight(image: BoxElement, getH: (c: Ctx) => number, opts: Opts = {}): LayoutNode {
    return el(image, {
        style: (c) => {
            const h = getH(c);
            setSizeY(image, h);
            setSizeX(image, h * aspectRatio(image));
        },
        ...opts,
    });
}

export function imageWithWidth(image: BoxElement, scale: number): LayoutNode {
    return imageByWidth(image, (c) => scale * c.s, { align: Align.Center });
}

export function imageWithHeight(image: BoxElement, scale: number): LayoutNode {
    return imageByHeight(image, (c) => scale * c.s, { align: Align.Center });
}

export function imageWithParentWidth(image: BoxElement, scale: number): LayoutNode {
    return imageByWidth(image, (c) => scale * c.parent.w, { align: Align.Center });
}

export function imageWithFillWidth(image: BoxElement): LayoutNode {
    return imageWithParentWidth(image, 1);
}

export function imageWithFillHeight(image: BoxElement): LayoutNode {
    return imageByHeight(image, (c) => c.parent.h, { align: Align.Center });
}

// --- 1. size ---------------------------------------------------------------

function resolve(node: LayoutNode, ctx: Ctx) {
    if (node.spacer != null) return; // size handled by the parent flow

    if (node.children) {
        // definite sizes first so children can read them as a percent-of-parent
        if (node.w) node.box.w = node.w(ctx);
        if (node.h) node.box.h = node.h(ctx);
        node.style?.(ctx);

        const childCtx: Ctx = { s: ctx.s, parent: node.box };
        for (const child of node.children) resolve(child, childCtx);

        aggregate(node, ctx.s);
        return;
    }

    // leaf: style first, then measure whatever wasn't explicitly driven
    node.style?.(ctx);
    node.box.w = node.w ? node.w(ctx) : node.el ? sizeX(node.el) : 0;
    node.box.h = node.h ? node.h(ctx) : node.el ? sizeY(node.el) : 0;
}

// content sizes: main axis = sum of children + gaps, cross axis = max of children
function aggregate(node: LayoutNode, s: number) {
    const main = node.dir === Axis.X ? "w" : "h";
    const cross = node.dir === Axis.X ? "h" : "w";

    let sum = 0;
    let max = 0;
    for (const child of node.children!) {
        if (child.float) continue;
        if (child.spacer != null) {
            sum += child.spacer * s;
            continue;
        }
        if (!child.alignAlongFlow) sum += child.box[main];
        max = Math.max(max, child.box[cross]);
    }

    if (!node[main]) node.box[main] = sum;
    if (!node[cross]) node.box[cross] = max;
}

// --- 2. position (skeleton) ------------------------------------------------

function positionChildren(node: LayoutNode, s: number) {
    if (!node.children) return;
    if (node.anchored) positionAnchored(node, s);
    else positionFlow(node, s);
}

function positionSkeleton(node: LayoutNode, x: number, y: number, s: number) {
    node.box.x = x;
    node.box.y = y;
    positionChildren(node, s);
}

function alignOffset(align: Align = Align.Start, extent: number, size: number) {
    if (align === Align.Center) return (extent - size) / 2;
    if (align === Align.End) return extent - size;
    return 0;
}

// place one child at a given main-axis coordinate, applying its cross-axis alignment
function placeChild(node: LayoutNode, child: LayoutNode, main: number, s: number) {
    const horiz = node.dir === Axis.X;
    const crossOrigin = horiz ? node.box.y : node.box.x;
    const crossExtent = horiz ? node.box.h : node.box.w;
    const childCross = horiz ? child.box.h : child.box.w;
    const cross = crossOrigin + alignOffset(child.align, crossExtent, childCross);
    positionSkeleton(child, horiz ? main : cross, horiz ? cross : main, s);
}

function positionFlow(node: LayoutNode, s: number) {
    const horiz = node.dir === Axis.X;
    const mainSize = horiz ? "w" : "h";
    let cursor = horiz ? node.box.x : node.box.y;

    if (node.children!.some((c) => c.alignAlongFlow) && !(horiz ? node.w : node.h)) console.error(`newLayoutEngine: alignAlongFlow requires an explicit ${horiz ? "w" : "h"} on the container`);

    for (const child of node.children!) {
        if (child.spacer != null) {
            cursor += child.spacer * s;
            continue;
        }
        if (child.float) {
            positionSkeleton(child, 0, 0, s); // real position comes from its place()
            continue;
        }
        if (child.alignAlongFlow) {
            const mainOrigin = horiz ? node.box.x : node.box.y;
            const offset = alignOffset(child.alignAlongFlow, node.box[mainSize], child.box[mainSize]);
            placeChild(node, child, mainOrigin + offset, s);
            continue; // does not advance cursor
        }
        placeChild(node, child, cursor, s);
        cursor += child.box[mainSize];
    }
}

// center the anchor on the main axis, then flow other items backward/forward off its edges
function positionAnchored(node: LayoutNode, s: number) {
    const horiz = node.dir === Axis.X;
    const mainPos = horiz ? "x" : "y";
    const mainSize = horiz ? "w" : "h";
    const flowed = node.children!.filter((c) => !c.float);

    const anchorIndex = flowed.findIndex((c) => c.anchor);
    const anchor = flowed[anchorIndex];
    const anchorMain = node.box[mainPos] + (node.box[mainSize] - anchor.box[mainSize]) / 2;
    placeChild(node, anchor, anchorMain, s);

    let after = anchorMain + anchor.box[mainSize];
    for (let i = anchorIndex + 1; i < flowed.length; i++) {
        const child = flowed[i];
        if (child.spacer != null) {
            after += child.spacer * s;
            continue;
        }
        placeChild(node, child, after, s);
        after += child.box[mainSize];
    }

    let before = anchorMain;
    for (let i = anchorIndex - 1; i >= 0; i--) {
        const child = flowed[i];
        if (child.spacer != null) {
            before -= child.spacer * s;
            continue;
        }
        before -= child.box[mainSize];
        placeChild(node, child, before, s);
    }
}

// --- 3 & 4. overrides + sync ----------------------------------------------

function runPlace(node: LayoutNode, s: number) {
    // pre-order: a parent/earlier sibling is placed before later ones
    if (node.place) {
        node.place(node.box, s);
        positionChildren(node, s); // box moved → re-flow descendants relative to its new origin
    }
    node.children?.forEach((c) => runPlace(c, s));
}

function sync(node: LayoutNode) {
    if (node.el) {
        node.el.style.left = px(node.box.x);
        node.el.style.top = px(node.box.y);
    }
    node.children?.forEach(sync);
}

function runPost(node: LayoutNode) {
    node.post?.();
    node.children?.forEach(runPost);
}

export function run(root: LayoutNode, s: number) {
    resolve(root, { s, parent: { x: 0, y: 0, w: 0, h: s } });
    positionSkeleton(root, 0, 0, s);
    runPlace(root, s);
    sync(root);
    runPost(root);
}

// Relative placement helpers, for use inside a node's place() callback.
// Each adjusts `self` against a reference box (typically a sibling's resolved box).

export function alignBottom(self: Box, ref: Box) {
    self.y = ref.y + ref.h - self.h; // self's bottom edge lands on ref's bottom edge
}

export function alignTop(self: Box, ref: Box) {
    self.y = ref.y;
}

export function centerX(self: Box, ref: Box) {
    self.x = ref.x + (ref.w - self.w) / 2; // self horizontally centered over ref
}

export function centerY(self: Box, ref: Box) {
    self.y = ref.y + (ref.h - self.h) / 2;
}

export function above(self: Box, ref: Box, gap = 0) {
    self.y = ref.y - self.h - gap; // self sits above ref, separated by gap
}

export function below(self: Box, ref: Box, gap = 0) {
    self.y = ref.y + ref.h + gap;
}

// Direct px setters live in layout.ts; re-exported here for escape-hatch code that writes the DOM outside the tree.
export { setSizeX, setSizeY, setPosX, setPosY } from "./layout";
