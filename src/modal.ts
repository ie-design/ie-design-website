import { body, bodySig } from "./constants";
import { px } from "./layout";
import { effect, Signal } from "./signal";
import { animateSpring, Spring } from "./spring";

export class Modal {
    isOpening = false;
    spring: Spring;
    springSig: Signal;

    static isAnyModalOpen = false;

    onLayout = () => {};

    constructor(color: string, onOpen: (backdrop: HTMLElement) => void, private onAnimate: (time: number) => void, onClose: () => void) {
        this.spring = new Spring(0);
        this.spring.setStiffnessCritical(120);
        this.springSig = new Signal();

        this.spring.onUnrest = () => {
            if (this.spring.position === 0) openModal();
        };

        let closeModal: () => void | undefined;
        this.spring.onRest = () => {
            if (this.spring.position === 0 && closeModal) closeModal();
        };

        const openModal = () => {
            const backdrop = document.createElement("div");
            backdrop.style.position = "fixed";
            backdrop.style.backgroundColor = color;
            body.appendChild(backdrop);

            onOpen(backdrop);

            const animate = () => {
                const time = this.spring.position;
                backdrop.style.opacity = time + "";
                backdrop.style.pointerEvents = time > 0.9 ? "all" : "none";
                this.onAnimate(time);
            };

            effect(animate, [this.springSig]);

            const layoutModal = () => {
                backdrop.style.width = px(innerWidth);
                backdrop.style.height = px(innerHeight);

                this.onLayout();
            };

            effect(layoutModal, [bodySig]);

            closeModal = () => {
                bodySig.unsubscribe(layoutModal);
                this.springSig.unsubscribe(animate);
                body.removeChild(backdrop);
                onClose();
            };
        };
        this.onAnimate(0);
    }

    beginOpen = () => {
        const escapeKeyListener = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                this.beginClose();
                document.removeEventListener("keydown", escapeKeyListener);
            }
        };

        document.addEventListener("keydown", escapeKeyListener);

        this.spring.target = 1;
        animateSpring(this.spring, this.springSig);
        this.isOpening = true;
        Modal.isAnyModalOpen = true;
    };

    beginClose = () => {
        this.spring.target = 0;
        animateSpring(this.spring, this.springSig);
        this.isOpening = false;
        Modal.isAnyModalOpen = false;
    };
}
