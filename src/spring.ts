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
        const step = millis - lastMillis;
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
