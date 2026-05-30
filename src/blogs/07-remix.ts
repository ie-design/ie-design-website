import { Blog } from "./blog";

export const remixBlog = new Blog(
    "07-remix", // -
    "REMIX",
    "A behind-the-scenes look at how we transformed classic memory carriers into objects of art.",
    (b: Blog) => {
        b.addParagraph("By Lee Lipscomb");
        b.addParagraph("I love learning how things are created. Whether it’s a podcast about how the parts of a song come together or a behind-the-scenes video explaining the making of a unique film sequence, I’m always inspired by creative problem solving. So I thought it would be fun to share how i.e. design elevated some very old objects into classy images for our client, Fotostori.");
        b.addParagraph("Fotostori is a company solely dedicated to the archiving of treasured images, audio recordings, and films. It was important to show these “memory carriers” on the website to communicate the archiving concept. In their original state, however, these film reels, VHS tapes and other items looked dingy, weathered, even rusty.  We didn’t want the site to look like a yard sale. It needed to reflect an upscale curation company. The challenge was how to give these objects a more elevated appearance. Our solution brought them front and center in a smart, creative way.");
        b.addSubhead("Digging in my closets.");
        b.addParagraph("We decided to paint all of the objects matte white so they’d become more symbolic design elements than literal representations of the various media. Fortunately, I had a large collection of most of the items that we needed. Having digitized my family’s slides and 8mm films, I was able to use the original reels and film strips, along with the coveted carousel. The VHS and cassette tapes were also easy, since I had several of those as well. So it was a quick task to assemble them for the painting process.");
        b.addSpace();
        b.addImage("raw-media.jpg");
        b.addImage("wheels.jpg");
        b.addSpace();
        b.addSubhead("Lots of spray paint.");
        b.addParagraph("The objects were prepped by cleaning surfaces, removing stickers and smoothing any rough edges with sandpaper. Beth and I have a go-to brand of white, matte spray paint that we’ve used on other projects. An outdoor area was set up for the spraying. Light layers of paint were built up over two days. A few cans of spray paint and several face masks later, we had the objects ready for our photo shoot.");
        b.addSpace();
        b.addImage("paint.jpg");
        b.addSpace();
        b.addSubhead("Fetch me a T-Square.");
        b.addParagraph("Composing the objects for these shots drew on my many years of experience as an art director and stylist. I wanted to create a balance of tension and flow, all while making sure the objects could actually be recognized. My T-square and triangles came in handy as I worked to get everything as aligned “in camera” as possible. Photoshop can correct many errors, but it’s best to take care of this kind of thing on set to save time.");
        b.addSpace();
        b.addImage("white-media.jpg");
        b.addSpace();
        b.addSubhead("Ordinary to extraordinary.");
        b.addParagraph("The objects were arranged on a clean white surface. I mounted the camera to a boom arm so the shots had an overhead orientation. A soft box provided the lighting. Once our client approved the composition, each image was converted to black and white. The result is a clean, elegant representation of Fotostori’s excellent service and uncompromising attention to detail.");
        b.addSpace();
        b.addImage("composed-white-media.jpg");
        b.addSpace();
        b.addParagraph("Lee Lipscomb is i.e. design’s Senior Designer. The cassette tape featured is a recording of a 1973 Telly Savalas album called “Telly.”  It includes his stunning cover of the song “If.”");
    }
);
