import { addBlog, BlogContext } from "./blog";

export const addTheViewFromInsideBlog = addBlog("03-the-view-from-inside", (b: BlogContext) => {
    b.addImage("inside.jpg");
    b.addSpace();
    b.addHead("The View From Inside");
    b.addParagraph("By Bethlyn Krakauer");
    b.addSpace();

    b.addSubhead("It’s true. You can work from anywhere.");
    b.addParagraph("I’ve prepared presentations sitting on the beaten up floors of a Gramercy Park loft and watched from the 18th floor the colors on my drafting board go warm as the sun set over Union Square. I’ve invented names and lives for the people I observed working directly across from my East 21st Street windows, and they observed me. One even sent over tea but that’s a story for another time. I’ve started over in a 600-square foot apartment with a view of a dive bar and spent some of my best years building my company inside an awesome Chelsea studio with funky, angled walls. I loved the energy of that place, despite its fire escape view of an alley. As I write this, I’m preparing to pack up an office with a pretty view of flowering cherry trees. Yet, with all that these places had to offer, there was always some elusive feature missing or an obstacle to work around.");

    b.addSubhead("Environment matters.");
    b.addParagraph("I’ve spent a good part of my life in pursuit of surroundings that move me, craving continuous change to keep life fresh yet needing the security and consistency of home base to keep me grounded. To date, WHERE to work has always included having to let go of something in exchange for something else. Security for freedom. Space for location. Location for space. Convenience for privacy. Privacy for support. Professional ambition for family time. I assured myself that one day I would reconcile it all. And here it is. Real. Open. And absolutely full of possibility.");
    b.addParagraph("This moment has been a long time coming and I’m not referring to the many delays construction presented. This build, from the ground up, is the culmination of almost 30 years of defining and evolving i.e. design. Welcome to my blank canvas, a room waiting to be filled with creative buzz, new opportunities, and meaningful projects with people I admire, respect, and simply like being around.");

    b.addSubhead("It feels different here.");
    b.addParagraph("There is an energy I draw from this place as does everyone I’ve had the privilege of sharing the breathtaking view with these past months. People often say that you’ll know it when you see it. I certainly saw it here and I hope the right people will too. So, whether we choose to meet each other in person, or connect from afar, this place was built to share and achieve something special and to partner with others who are looking to do the same through their passions, talents, and drive. I am thrilled to have assembled an incredibly talented, dedicated, and diverse team and we’re ready to get to work.");
    b.addParagraph("I hope that the stories, images and insights that follow will offer something relatable, useful, entertaining, and, most of all, inspiring.");
    b.addParagraph("Thank you for stopping by.");

    b.addSpace();
    b.addParagraph("Bethlyn Krakauer is i.e. design’s Founder and Creative Director. She is shown inside the newly constructed studio in her favorite chair.");
});
