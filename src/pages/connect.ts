import { aligningWithGapsX, aligningWithGapsY, posX, posY, px, sizeX, sizeY, styleText } from "../layout";
import { registerUpdateLayout } from "../page";
import { addScrollImage, addScrollSvg, addScrollText, centerWithinScrollY, getScrollHeight, resizeScrollContainerLandscape } from "../scroll";

function addIcon(imageSrc: string, clickLink: string) {
    const icon = addScrollSvg(imageSrc);
    icon.style.cursor = "pointer";
    icon.onclick = () => window.open(clickLink);
    return icon;
}

export function addConnectPage() {
    const connect = addScrollSvg("connect/connect.svg");
    const texts = [
        addScrollText("Our clients look to us for more than award-winning design. They value our role as trusted advisor, support, and confidant."), // -
        addScrollText("We look for synergy and compatibility in every relationship we build so the work experience doesn’t feel like work at all."),
        addScrollText("If your gut is telling you we should connect, now is the perfect time to email."),
    ];
    const letsMeet = addScrollImage("connect/lets-meet.jpg");
    const who = addScrollText("Bethlyn Krakauer, Founder and Creative Director");

    const instagramIcon = addIcon("connect/instagram-icon.svg", "https://www.instagram.com/iedesigninc");
    const linkedinIcon = addIcon("connect/linkedin-icon.svg", "https://www.linkedin.com/company/i-e-design-inc");
    const mailIcon = addIcon("connect/mail-icon.svg", "mailto:beth@ie-design.com");

    const icons = [instagramIcon, linkedinIcon, mailIcon];

    registerUpdateLayout(() => {
        resizeScrollContainerLandscape();
        const s = getScrollHeight();

        const width = 0.55 * s;
        connect.style.width = px(width);
        centerWithinScrollY(letsMeet, 0.8);

        for (const text of texts) styleText(text, { letterSpacing: 0.0009 * s, fontWeight: 350, color: "#000000", fontSize: 0.028 * s, width, lineHeight: 0.05 * s });
        styleText(who, { letterSpacing: 0.0009 * s, fontWeight: 350, color: "#000000", fontSize: 0.028 * s, width: 1 * s, lineHeight: 0.05 * s });

        const [elementAlignments, _] = aligningWithGapsY([
            connect, // -
            0.09 * s,
            texts[0],
            0.03 * s,
            texts[1],
            0.03 * s,
            texts[2],
        ]);

        for (const { element, offset } of elementAlignments) {
            element.style.top = px(offset + 0.05 * s);
        }

        letsMeet.style.left = px(posX(connect) + sizeX(connect) + 0.15 * s);

        who.style.left = px(posX(letsMeet));
        who.style.top = px(posY(letsMeet) + sizeY(letsMeet) + 0.04 * s);

        for (const icon of icons) {
            icon.style.width = px(s * 0.055);
            const lastText = texts[texts.length - 1];
            icon.style.top = px(posY(lastText) + sizeY(lastText) + 0.03 * s);
        }
        const [iconAlignments, __] = aligningWithGapsX([instagramIcon, 0.03 * s, linkedinIcon, 0.03 * s, mailIcon]);

        for (const { element, offset } of iconAlignments) {
            element.style.left = px(offset);
        }
    });
}
