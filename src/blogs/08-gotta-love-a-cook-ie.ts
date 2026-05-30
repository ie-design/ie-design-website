import { Blog } from "./blog";

export const gottaLoveACookIeBlog = new Blog(
    "08-gotta-love-a-cook-ie", // -
    "GOTTA LOVE A COOK-IE",
    "How a secret recipe works to bring relationships to a whole new level.",
    (b: Blog) => {
        b.addParagraph("By Bethlyn Krakauer");
        b.addParagraph("Anyone who knows us knows that we are magnets for really good chocolate and home-baked treats. If we aren’t making or eating something yummy, chances are we’re thinking about it. Back in i.e. design’s New York City days, homemade cookies found their way into more than one holiday promotion and many afternoons, around 4 pm. Thanks to this reputation, I’m sure, a friend gave me a cookie decorating gift basket from the famous NY Cake on 22nd Street and unknowingly started a love affair between a designer and her dream cookie. I’d come home from work late in those days, still wound up with nowhere to put my energy. I’d whip up a double batch of sugar cookie dough, grab some funky cutters, bake, and experiment with artist brushes and royal icing until the wee hours.");
        b.addParagraph("These meticulous masterpieces were brought to the office for my peeps and for the lucky clients who happened to be meeting with us that day. One such client secretly showed them to the cafe owner down the street and brokered my first order for 200. I was pumped to finally have an excuse to buy Costco-sized ingredients. Every surface of my tiny kitchen was covered with an assembly line of cookies each weekend, and so it went until I calculated that my labor of love had me losing about 30 cents a piece.");
        b.addSpace();
        b.addImage("boxes.jpg");
        b.addSpace();
        b.addSubhead("Reaching the next level of connection to the cookie.");
        b.addParagraph("There are cookies and there are cook-i.e.s. After years of baking exploration, I was gifted the recipe of mastery that has become synonymous with the i.e. design standard. Cook-i.e.s are available exclusively through i.e. design and embody the very values we bring to our work; the love and expertise for our craft, meticulous attention to detail, and the joy of bringing happiness to people by sharing something special. Cook-i.e.s are made in tiny little batches using extra care. The secret recipe is 100% original and contains no artificial anything. Like every project we get our hands on, it’s all good.");
        b.addParagraph("You can taste the passion that goes into our good-i.e.s. Our proof is when family, friends, and clients alike say, “OMG, you should sell these!” Maybe, someday soon, we will. For now, you need only to be a promising prospect to get your hands on one. Our clients receive a set at the close of their project. One to enjoy and one to share, ideally with someone else who could use a good design fix, but we won’t judge if they eat both. After all, each bite of these five-inch, part-crispy, part-chewy cook-i.e.s is filled with layers of the very best, highest-quality chocolate. They usually disappear just – like – that!");
        b.addSpace();
        b.addImage("cookies.jpg");
        b.addSpace();
        b.addSubhead("The cook-i.e.s are really good and so are we.");
        b.addParagraph("If you’re a good human who is curious about how we transform our client’s businesses through the power of strong design, visit us at our studio. Chances are we’ll have something yum-i.e. waiting for you. Not in the neighborhood? No problem. We can ship our fresh-baked good-i.e.s pretty much anywhere. You just need to grab the milk, the tea, or the coffee, and we’ll talk.");
        b.addSpace();
        b.addParagraph("Bethlyn Krakauer is i.e. design’s Founder and Creative Director. When not working with clients to forward their brands, she can be found calibrating her oven temperature and sampling a bit too much for quality control.");
    }
);
