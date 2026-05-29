import { addBlog, BlogContext } from "./blog";

export const addBrandingFromTheNameUpBlog = addBlog("05-branding-from-the-name-up", (b: BlogContext) => {
    b.addImage("white.jpg");
    b.addSpace();
});
