import { Router } from "express";
import {
  CreatePost,
  DeletePost,
  GetAllBlogs,
  GetASpecificPost,
  GetIndividualPosts,
  UpdateAPost,
} from "../controllers/posts";
import { verify } from "../middleware/verify";

const postRouter = Router();
postRouter.post("/", verify, CreatePost);
postRouter.get("/", verify, GetAllBlogs);
postRouter.get("/:blogId", verify, GetASpecificPost);
postRouter.get("/user/blog", verify, GetIndividualPosts);
postRouter.patch("/:blogId", verify, UpdateAPost);
postRouter.delete("/:blogId", verify, DeletePost);

export default postRouter;
