import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";

const getProjectPosts = (posts: CollectionEntry<"blog">[]) => {
  return getSortedPosts(posts).filter(post => 
    post.data.tags.includes("project")
  );
};

export default getProjectPosts; 