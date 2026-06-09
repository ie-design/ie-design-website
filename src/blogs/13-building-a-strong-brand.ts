import { link } from "../components";
import { Blog } from "./blog";

export const buildingAStrongBrandBlog = new Blog(
    "BUILDING A STRONG BRAND", // -
    "How to know if your brand measures up and when it’s time to evolve.",
    (b: Blog) => {
        b.addParagraph("By Bethlyn Krakauer");
        b.addParagraph("Nobody knows your business like you do. When you are the face of your company, no one tells its story with more passion or conviction.");
        b.addParagraph("You may already deliver exceptional products or valuable services, but what if your brand isn’t fully reflecting it? When your brand is doing the talking for you, what is it saying?");
        b.addSubhead("Trust your gut.");
        b.addParagraph("If that internal voice is telling you something feels misaligned, it is. Even if no one says it directly, your customers, employees, and competition notice.");
        b.addParagraph("Every touchpoint, from your logo to your website, your packaging to your promotions, your print communications to your social media, signals your integrity, value, and worth. It may be difficult to prove that you are losing business due to aesthetically inferior branding. Many companies succeed despite less-than-optimal design. So why does it matter?");
        b.addSubhead("Because branding is a multiplier.");
        b.addParagraph("Like a steel foundation beneath a building, a powerful visual identity elevates everything above it. When your brand reflects not only who you are, but what you are becoming, clearer direction, stronger perceived value, and greater opportunity naturally follow.");
        b.addParagraph("We all recognize brands that exude confidence and quality – the Hermès orange box, the Rolex crown, Audi’s rings. Perceived or real, we instantly assign value and trust. Yet, there are thousands of good businesses losing momentum and edge because their branding doesn’t match their level of excellence. And that limits growth.");
        b.addParagraph("If you recognize that your brand no longer reflects the level at which you operate, it’s time to pursue a solution.");
        b.addSpace();
        b.addImage("new-invitation.jpg");
        b.addSpace();
        b.addSubhead("This is a strategic exchange, not a presentation.");
        b.addParagraph("This curated gathering is intentionally limited to nine participants to ensure a high-level, strategic dialogue and meaningful benefit. It is designed for those who are actively evaluating the future direction of their brand.");
        b.addSubhead("Where:");
        b.addParagraph("The i.e. design studio, Califon, NJ");
        b.addSubhead("When:");
        b.addParagraph("Wednesday, March 25, 2026  6–8:30pm");
        b.addSubhead("What is a Square Table?");
        b.addParagraph("It is an intimate, structured, collaborative discussion that encourages participation and focused conversation. This gathering of established business owners and leaders fosters a welcoming setting for open dialogue, strategic brainstorming, and the exchange of high-level insight.");
        b.addSubhead("Who should attend?");
        b.addParagraph("This event is designed for established business owners and leaders who believe their brand should reflect the true caliber of their work and are ready for a meaningful identity evolution.");
        b.addSubhead("What should I bring?");
        b.addParagraph("You are welcome to bring any printed or digital material representing your current branding or upcoming initiatives that require a cohesive visual identity.");
        b.addSubhead("What should I expect?");
        b.addParagraph("Led by award-winning designer and founder of i.e. design, Bethlyn Krakauer, this session offers strategic perspective and candid insight from accomplished women in business who value excellence and growth. You will leave with sharper clarity and a more decisive path forward to elevate your brand and align it with your vision.");
        b.addSubhead("Will there be food?");
        b.addParagraph("").append(
            "Yes. Inspired bites and beverages will be provided by Chef Gayon, founder of ", // -
            link("Five Tastes", "https://www.thefivetastes.com/"),
            "."
        );
        // MISSING "Click here to apply to attend."
        b.addSpace();
        b.addImage("studio.jpg");
        b.addSpace();
        b.addParagraph("Bethlyn Krakauer, in her studio overlooking Tewksbury, NJ. She is i.e. design’s Founder and Creative Director.");
    }
);
