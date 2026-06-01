import { Blog } from "./blog";

export const growingTheDreamBlog = new Blog(
    "GROWING THE DREAM", // -
    "Building a bold brand for an emerging mental health collective.",
    (b: Blog) => {
        b.addParagraph("By Bethlyn Krakauer");
        b.addParagraph("Stephanie Joos and I go way back to when our now-grown boys were best friends at our beloved Acorn Montessori School. Having since moved to Austin, it was a rare treat to have her here for a visit and share a long overdue catch-up.");
        b.addParagraph("Stephanie was excited about completing her advanced degree in clinical psychology and eager to launch her new career. She wasn’t looking to start small. She had a bold vision of a network of like-minded, health-oriented professionals, working together to help as many people as possible. A space where people, especially emerging adults, would be supported, nurtured, and propelled into personal growth and well-being.");
        b.addParagraph("With years of corporate and personal experience under her belt, she saw herself not just as a solo practitioner, but as the leader of something bigger. Inspired by her ambition, I encouraged her to think beyond a typical startup approach and instead build the company she envisioned five years down the road.");
        b.addParagraph("Stephanie embraced the idea wholeheartedly and we dove in, head-first. The first few weeks were spent brainstorming company names, researching competitors, and exploring similar businesses in her home base of Texas. After much deliberation, we landed on a name that felt both fresh and welcoming—a phonetic spelling of “Thrive” combined with the warmth and flexibility of “Collective.”");
        b.addSubhead("Crafting a brand identity from inspiration to execution.");
        b.addParagraph("Our design process began with an unexpected muse: Stephanie’s gorgeous Weimaraner, Auggie, who attended every meeting, hanging out in the Zoom background. His sleek, silvery-gray coat became the cornerstone color chip of our palette. We asked Stephanie to provide images of spaces that instilled a sense of calm and peace for her personally, and used those to inspire a mood board that informed the design of her office. These personal insights expanded our color palette, introducing warm, nurturing tones and a vibrant green to symbolize growth and vitality.");
        b.addParagraph("The logo’s creation came from many hours of brainstorming and sketching. We explored countless conceptual directions and experimented with diverse styles and visual metaphors that captured the essence of thriving. The final pick, nicknamed “springy”, was the result of a loose, gestural expression of sprouting leaves. As is often the case, the most powerful designs emerge not through forced effort, but through a state of fluid, intuitive exploration. After free-handing the movement over and over, one in particular just worked.");
        b.addParagraph("Transitioning our hand-sketched concept into Adobe Illustrator allowed us to meticulously sculpt each curve and adjust line thickness. This digital fine-tuning transformed our initial spark of inspiration into a polished, purposeful visual identity that truly represents the Thrīv Collective brand.");
        b.addSpace();
        b.addImage("branding.jpg");
        b.addSpace();
        b.addSubhead("The power of a perfect portrait.");
        b.addParagraph("").append(
            "Stephanie swore on a stack of chocolate that no one had ever taken a truly good photograph of her. Challenge accepted. By partnering with ", // -
            b.link("Melissa Glynn", "https://www.melissaglynn.com/"),
            " a photographer specializing in women’s portraiture, we transformed Stephanie’s perception of herself in front of the camera. Utilizing the soft, natural light of her home studio, the photographer created an environment where Stephanie felt completely at ease. It didn’t hurt that Stephanie immediately fell in love with the photographer’s Yorkie."
        );
        b.addParagraph("The result was a fantastic collection of images that capture Stephanie’s confidence and warmth, presenting her as the approachable, professional she is. These images are perfect for her website and upcoming speaking engagements, ensuring she makes a memorable first impression. They demonstrate how investing in high-quality photography can elevate a professional’s visual identity.");
        b.addSpace();
        b.addImage("portraits.jpg");
        b.addSpace();
        b.addSubhead("A website design with a purpose.");
        b.addParagraph("").append(
            "The ", // -
            b.link("website", "https://www.thrivcollective.com/"),
            " design embodies Thrīv Collective’s core mission: to provide a supportive space for clients’ personal growth. The tagline introduces her process and potential benefits, while an animated graphic tells the visual story of transformation, as a bare branch progresses through stages of growth, from sprouting green leaves to emerging flowers. It communicates Thrīv Collective’s fundamental belief that every individual has the innate capacity to grow, heal, and ultimately blossom, given the right support and environment."
        );
        b.addSpace();
        b.addImage("site-1.jpg");
        b.addSpace();
        b.addSubhead("Supporting emerging adults.");
        b.addParagraph("Thrīv Collective serves adults struggling with anxiety, depression, ADHD, complex trauma, and emotional challenges like feeling worthless and disconnected. The website includes the kind of “self-talk” that speaks directly to a potential client’s internal experiences, reinforcing that Stephanie genuinely understands and meets her clients where they are.");
        b.addSpace();
        b.addImage("site-2.jpg");
        b.addSpace();
        b.addSubhead("The final touch on a great project.");
        b.addParagraph("When a client is truly committed and open-minded, design projects transform from tasks into collaborative adventures. Stephanie’s proactive approach and willingness to engage made every stage of our work incredibly productive and genuinely enjoyable. Her drive and readiness to trust us made this project an exceptional one, right down to the ultra-premium business card.");
        b.addSpace();
        b.addImage("business-cards.jpg");
        b.addSpace();
        b.addImage("quote.jpg", 0.5);
        b.addSpace();
        b.addParagraph("Bethlyn Krakauer is i.e. design’s Founder and Creative Director.");
    }
);
