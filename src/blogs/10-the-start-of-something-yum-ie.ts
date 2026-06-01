import { Blog } from "./blog";

export const theStartOfSomethingYumIeBlog = new Blog(
    "THE START OF SOMETHING YUM-IE", // -
    "We always wanted to design chocolate bars and finally did it. Introducing our sweet new brand.",
    (b: Blog) => {
        b.addParagraph("By Bethlyn Krakauer");
        b.addParagraph("Not too long ago, we began gifting our decadent, home-baked chocolate-chip cookies and brownies to our clients to show our appreciation and share our passion for simple, premium chocolate. In classic i.e. design form, we called our sweet treats “good-i.e.s” and “cook-i.e.s” and branded them “yum-i.e.”  A bunch of folks said we should sell our edible creations and we thought so too. So, as part of the ongoing evolution of i.e. design, we secured yum-ie.com with the goal of setting up a little store someday.");
        b.addSubhead("The need for a chocolate fix.");
        b.addParagraph("Here at i.e. design, chocolate is an ongoing conversation and a staple in our desk drawers. Milk and dark, we’ve tried them all. We’re on an endless quest to satisfy our craving. As designers, we can’t help but zone in on the packaging that wraps all the varieties, whether from our local stops or from around the world. It’s in our creative, perfection-seeking nature to want to redesign pretty much everything we get our hands on. Any snacking on chocolate is an opportunity to critique its presentation. For years, we joked about designing our own bar and we finally did it! Once we decided to go for it, the brainstorming kicked in and things quickly came together. It was exciting to expand our long-established blue and green branding by adding new colors and reinventing our “ie” typography. We had a blast designing every aspect of the packaging, especially the yum-ie yum-ie chocolate bar itself.");
        b.addSpace();
        b.addImage("bar-shots.jpg");
        b.addSpace();
        b.addSubhead("Simple. Tastefully designed. Chocolate.");
        b.addParagraph("We are bit infatuated with our smooth-milk and snappy-dark chocolate bars and would love to share them with the world. With your support, a larger run, expansion of the yum-ie brand, and our store are in the not-too-distant future. For now, we have a limited quantity of our 9-bar gift boxes just waiting to be given away. One box can be yours for meeting with us to discuss how we can help you make your passion project a well-designed reality.");
        b.addParagraph("Have a desire for yum-ie chocolate but not currently in the market for an exceptional logo, website, package design, or brand overhaul? No problem. Your personal introduction to a super-nice person with a promising project will land you both a box of yum-ie chocolate bars and life will become just a little bit sweeter.");
        b.addSpace();
        b.addParagraph("Bethlyn Krakauer is i.e. design’s Founder and Creative Director. Beth’s passion for packaging design found its perfect match in this venture. Anyone who knows her suspects she orchestrated this whole thing just to have an endless supply of chocolate.");
    }
);
