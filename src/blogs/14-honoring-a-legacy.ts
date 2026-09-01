import { link } from "../components";
import { Blog } from "./blog";

export const honoringALegacy = new Blog(
    "HONORING A LEGACY", // -
    "How thoughtful design helped bring a remarkable woman’s foundation to life.",
    (b: Blog) => {
        b.addParagraph("By Lee Lipscomb");
        b.addParagraph("A legacy lives only in the hands of those who remain. Without deliberate care, even the most significant contributions can fade. But when those closest to the work step forward with intention, legacy transforms from memory into living practice.");
        b.addParagraph("That was the weight the Foundation’s board carried when they came to us. Entrusted with establishing a lasting presence for ground breaking cookbook author, Diana Kennedy, who passed away in 2022 at age 99, they were not only stewards of her work but also close friends who had loved her. The challenge was creating a visual presence worthy of Diana’s extraordinary energy and importance. Still grieving, they needed help. We stepped in, immersed ourselves in Diana’s world through the documentary “Diana Kennedy: Nothing Fancy” and conversations with the trustees, and took on the writing they were too close to handle.");
        b.addSubhead("Defining the mission.");
        b.addParagraph("The Diana Kennedy Foundation exists to identify and support initiatives that advance the values Diana lived by. Rather than raising money directly, the website was designed to shine a light on the organizations the Foundation supports, with the hope that visitors would feel moved to follow Diana’s lead and support them too. The first recipient was the University of Texas at San Antonio, where Diana donated rare cookbooks, writings, and photographs before her death. With a tight deadline and no clear path to sourcing images from the archive, we needed another way in.");
        b.addImage("diane.jpg");
        b.addSpace();
        b.addSubhead("The images were waiting for us.");
        b.addParagraph(
            "The answer came through a single magazine article. In our research, we discovered a piece about Diana featuring the photography of ", // -
            link("Penny De Los Santos", "https://www.pennydelossantos.com/"),
            ", whose images, shot on an editorial assignment shortly before Diana’s passing, were warm, natural, and alive. We reached out, and Penny was generous with both her time and her archive. She had spent days with Diana at her home in the village of Zitácuaro in central Mexico, photographing her in the kitchen, moving through local markets, and greeting neighbors and friends. Many of those images had never been published. They were exactly what the site needed."
        );
        b.addParagraph("Having a single gifted photographer’s vision carry the entire visual story was a true gift. The portrait of Diana on the homepage was even sampled to build the site’s color palette, her spirit woven into the design itself.");
        b.addImage("block-quotes.jpg");
        b.addSpace();
        b.addSubhead("Letting Diana speak.");
        b.addParagraph("Diana was a force of nature who left lasting impressions on everyone who encountered her work. To capture that, we paired Penny’s images throughout the site with quotes from Diana herself and from the celebrated chefs she inspired, letting her passion for Mexican cuisine and culture come through in her own words and the words of those who admired her most.");
        b.addParagraph("The site also highlights the Foundation’s grant recipients, explaining why each was selected and how the funds will be used, while encouraging visitors to get involved or donate directly.");
        b.addParagraph(
            "The finished ", // -
            link("site", "https://www.dianakennedyfoundation.org/"),
            " brought one of the trustees to tears, and honestly, that said more than any approval ever could. The rest of the board felt the same way, and the Diana Kennedy Foundation finally had a presence as strong as her legacy."
        );
        b.addSpace();
        b.addQuote("quote.png");
        b.addSpace();
        b.addParagraph("Lee Lipscomb is i.e. design’s Senior Designer. She is taking Diana Kennedy’s advice to heart and keeping garlic out of her guacamole.");
    }
);
