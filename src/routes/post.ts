import { Router } from "express";
import {
  CreatePost,
  GetAllBlogs,
  GetASpecificPost,
  GetIndividualPosts,
} from "../controllers/posts";
import { verify } from "../middleware/verify";

const postRouter = Router();
postRouter.post("/", verify, CreatePost);
postRouter.get("/", verify, GetAllBlogs);
postRouter.get("/user/blog", verify, GetIndividualPosts);
postRouter.get("/:blogId", verify, GetASpecificPost);

export default postRouter;
