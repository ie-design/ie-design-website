import { Blog } from "./blog";

export const inspired2CreateBlog = new Blog(
    "04-inspired-2-create", // -
    "INSPIRED 2 CREATE",
    "A painting inspired by the i.e. design logo combines oil paints, ground up crayons, and a lego.",
    (b: Blog) => {
        b.addParagraph("By Lee Lipscomb");
        b.addSpace();
        b.addParagraph("At i.e. design, our creativity extends beyond graphic design. Our founder, Bethlyn Krakauer, designed her new studio and creates delightfully decorated baked goodies. For me, nature photography and painting have been my current obsessions. So, as a gift for the new studio, I grabbed my brushes and a 12″x12″ panel to produce my own interpretation of the i.e. design logo.");
        b.addParagraph("As a fan of process videos, I decided to film the project from start to finish for a potential blog post. No pressure. The final painting is the result of using the subtle changes in the i.e. blues and greens over the logo's history for the palette, as well as bits of past promotions to keep this thing on brand. (You can see the promos in the EVOLUTION section of the site). Ground up crayons added texture and Lego pieces, pressed into the oil and cold wax mixture, stamped the surface. This part wasn't filmed to protect crayola fans and Lego purists.");
        b.addParagraph("I hope you enjoy the process.");
        b.addVideo("making-painting.mp4", "painting-video-thumbnail.png");
        b.addSpace();
        b.addParagraph("Lee Lipscomb is i.e. design's Senior Designer. Two crayons were harmed in the making of this painting.");
    }
);
