import { body, bodySig } from "./constants";
import { px } from "./layout";
import { effect, Signal } from "./signal";
import { animateSpring, Spring } from "./spring";

export const MODAL_ZINDEX = 1;

export class Modal {
    wasLastOpened = false;
    spring: Spring;
    springSig: Signal;

    static isAnyModalOpen = false;

    onLayout = () => {};

    constructor(
        color: string,
        private onAnimate: (time: number) => void,
        private keyframes: {
            onBeginOpen: (backdrop: HTMLDivElement) => void; //
            onTriggerOpen: () => void;
            onTriggerClose: () => void;
            onEndClose: (backdrop: HTMLDivElement) => void;
        }
    ) {
        this.spring = new Spring(0);
        this.spring.setStiffnessCritical(120);
        this.springSig = new Signal();

        this.spring.onUnrest = () => {
            if (this.spring.position === 0) beginOpenModal();
        };

        let endCloseModal: () => void | undefined;
        this.spring.onRest = () => {
            if (this.spring.position === 0) endCloseModal && endCloseModal();
        };

        const beginOpenModal = () => {
            const backdrop = document.createElement("div");
            backdrop.style.position = "fixed";
            backdrop.style.backgroundColor = color;
            backdrop.style.zIndex = MODAL_ZINDEX + "";
            body.appendChild(backdrop);

            keyframes.onBeginOpen(backdrop);

            const animate = () => {
                const time = this.spring.position;
                backdrop.style.opacity = time + "";
                backdrop.style.pointerEvents = time > 0.9 ? "all" : "none";
                this.onAnimate(time);
            };

            effect(animate, [this.springSig]);

            const layoutModal = () => {
                const PAD = 10;
                backdrop.style.width = px(innerWidth + PAD);
                backdrop.style.height = px(innerHeight + PAD);

                this.onLayout();
            };

            effect(layoutModal, [bodySig]);

            const escapeKeyListener = (e: KeyboardEvent) => {
                if (e.key === "Escape") this.beginClose();
            };
            document.addEventListener("keydown", escapeKeyListener);

            endCloseModal = () => {
                bodySig.unsubscribe(layoutModal);
                this.springSig.unsubscribe(animate);
                body.removeChild(backdrop);
                document.removeEventListener("keydown", escapeKeyListener);
                keyframes.onEndClose(backdrop);
            };
        };
        this.onAnimate(0);
    }

    beginOpen = () => {
        this.keyframes.onTriggerOpen();
        this.spring.target = 1;
        animateSpring(this.spring, this.springSig);
        this.wasLastOpened = true;
        Modal.isAnyModalOpen = true;
    };

    beginClose = () => {
        this.keyframes.onTriggerClose();
        this.spring.target = 0;
        animateSpring(this.spring, this.springSig);
        this.wasLastOpened = false;
        Modal.isAnyModalOpen = false;
    };
}
