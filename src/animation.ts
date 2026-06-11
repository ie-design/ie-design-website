import { effect, Signal } from "./signal";

export class Spring {
    position: number;
    target: number;
    velocity = 0;
    damping = 0;
    stiffness = 0;
    isAnimating = false;

    onRest = () => {};
    onUnrest = () => {};

    // mx'' - bx' = kx

    constructor(initialValue: number) {
        this.position = initialValue;
        this.target = initialValue;
    }

    tick(dt: number) {
        const acceleration = this.stiffness * (this.target - this.position) - this.damping * this.velocity;
        this.velocity += acceleration * dt;
        this.position += this.velocity * dt;
    }

    setStiffnessCritical(stiffness: number) {
        this.stiffness = stiffness;
        this.damping = Math.sqrt(4 * stiffness);
    }
}

const DEFAULT_ANIMATION_TOLERANCE = 0.01;

export function animateSpringToTarget(spring: Spring, signal: Signal, target: number) {
    spring.target = target;
    animateSpring(spring, signal);
}

export function animateSpring(spring: Spring, signal: Signal) {
    if (spring.isAnimating) return;

    spring.isAnimating = true;
    spring.onUnrest();

    let lastMillis = 0;
    requestAnimationFrame(firstFrame);
    function firstFrame(millis: number) {
        lastMillis = millis;
        tickSpring(millis);
    }

    function tickSpring(millis: number) {
        const step = Math.min(millis - lastMillis, 1000 / 30); // cap to survive background tab / jank
        lastMillis = millis;

        spring.tick(step / 1000);
        signal.update();

        if (Math.abs(spring.target - spring.position) < DEFAULT_ANIMATION_TOLERANCE && Math.abs(spring.velocity) < DEFAULT_ANIMATION_TOLERANCE) {
            spring.position = spring.target;
            spring.velocity = 0;
            spring.isAnimating = false;
            signal.update();
            spring.onRest();
            return;
        }

        requestAnimationFrame(tickSpring);
    }
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
    return (t: number) => {
        let lo = 0,
            hi = 1,
            s = t;
        for (let i = 0; i < 12; i++) {
            const x = 3 * s * (1 - s) * (1 - s) * x1 + 3 * s * s * (1 - s) * x2 + s * s * s;
            if (Math.abs(x - t) < 1e-6) break;
            if (x > t) hi = s;
            else lo = s;
            s = (lo + hi) / 2;
        }
        return 3 * s * (1 - s) * (1 - s) * y1 + 3 * s * s * (1 - s) * y2 + s * s * s;
    };
}

export const easeOut = cubicBezier(0, 0, 0.2, 1);

export class AnimationContext {
    offset = 0;
    private listeners: Set<() => void> = new Set();

    step(seconds: number) {
        this.offset += seconds;
        this.listeners.forEach((fn) => fn());
    }

    onStep(fn: () => void) { this.listeners.add(fn); }
    offStep(fn: () => void) { this.listeners.delete(fn); }
}

export async function animateForTime(duration: number, onProgress: (t: number) => void, ease: (t: number) => number = easeOut, ctx?: AnimationContext) {
    return new Promise<void>((resolve) => {
        let startTime: number | null = null;
        const baseOffset = ctx?.offset ?? 0;

        const frame = (now: number) => {
            if (startTime === null) startTime = now;
            const elapsed = (now - startTime) + ((ctx?.offset ?? 0) - baseOffset) * 1000;
            const t = Math.min(elapsed / (duration * 1000), 1);
            onProgress(ease(t));
            if (t < 1) requestAnimationFrame(frame);
            else resolve();
        };

        requestAnimationFrame(frame);
    });
}

export async function animateWithSpring(stiffness: number, overTime: (time: number) => void) {
    return new Promise<void>((resolve) => {
        const spring = new Spring(0);
        const springSig = new Signal();
        spring.setStiffnessCritical(stiffness);
        spring.target = 1;

        const animate = () => overTime(spring.position);
        spring.onRest = () => {
            springSig.unsubscribe(animate);
            resolve();
        };

        effect(animate, [springSig]);

        animateSpring(spring, springSig);
    });
}
