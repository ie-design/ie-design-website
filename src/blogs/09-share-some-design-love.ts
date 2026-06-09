import { link } from "../components";
import { Blog } from "./blog";

export const shareSomeDesignLoveBlog = new Blog(
    "SHARE SOME DESIGN LOVE", // -
    "The i.e. design promo journals encourage clients to sketch their big ideas and capture their dreams.",
    (b: Blog) => {
        b.addParagraph("By Lee Lipscomb");
        b.addParagraph("We love journals and sketchbooks. As creatives, they allow us to generate ideas quickly with just a pen, pencil, or crayon. So when we were brainstorming gifts to give our clients, these beautiful books quickly rose to the top of the list. By giving a gift that we love and find useful ourselves, we are sharing something that we hope is meaningful to our clients.");
        b.addSubhead("A valuable tool for generating ideas and capturing your thoughts.");
        b.addParagraph("I have consistently kept journals and sketchbooks since my first job as a designer. One sketchbook was for filing all of my creative ideas, instructions from art directors, ripped images from magazines, and taped Polaroids from photoshoots. This book went with me everywhere in my bike messenger bag, getting banged around as I traveled. I also had a lined journal that stayed at my apartment for the quieter times with myself. I would treat it like a good friend or a therapist and purge my worries and thoughts that were bugging me. One of my journals was filled with passages from books I was reading, song lyrics that meant a lot, or random quotes overheard from others. It also stayed by my bedside to capture all of my crazy or cinematic dreams. The best thing about these books is that they can have a long life span and act as time capsules of your life.");
        b.addSpace();
        b.addImage("books.jpg");
        b.addSpace();
        b.addSubhead("Permission to mess up.");
        b.addParagraph("Yes, these deluxe journals would look great on a coffee table or added to a rainbow bookshelf, but our purpose in giving these to our clients is to inspire them to be creative. “WORDS” has lined pages to allow for jotting down ideas, unloading some stress, or setting daily goals. Its sister, “IDEAS” is a sketchbook to hold visual notes and inspired scribbles that just might lead to something genius. Our hope is that whoever receives these journals lets them get beat up, doesn’t mind a coffee spill, and really uses them. Our lives are worth recording.");
        b.addSubhead("They sure look nice.");
        b.addParagraph("").append(
            "I know what you are thinking. “How can I get a set of these fantastic books?” You become a client! We give them as a thank you for completing a project with us. These books are part of our everyday process. We put pen to paper long before we touch a keyboard or a mouse. It’s fun to view the initial brainstorming and see the progression of ideas and even the nugget that became the final solution. To be the next page in our sketchbook, ", // -
            link("email", "mailto:beth@ie-design.com"),
            " us. See more of our branded client gifts ",
            link("here", "https://ie-design.com/evolution"),
            "."
        );
        b.addSpace();
        b.addParagraph("Lee Lipscomb is i.e. design’s Senior Designer. She admits to treating her new books as too precious and addressed her fear of making the first mark by taking a big Sharpie to the first page and drawing a lighting bolt.");
    }
);
