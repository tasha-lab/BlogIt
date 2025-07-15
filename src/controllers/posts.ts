import { Posts } from "@prisma/client";
import { Request, Response } from "express";
import client from "../config/prismaclient";
import imagekit from "../config/imagekit";
import fs from "fs";

interface UserRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}
export const CreatePost = async (req: UserRequest, res: Response) => {
  try {
    const { title, synopsis, content } = req.body;
    const createrId = req.userId;
    const imageFile = req.file;

    if (!imageFile) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: `tasha/${Date.now()}`,
      folder: "/blogs",
    });

    fs.unlinkSync(imageFile.path);

    const imageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    if (!createrId) {
      res.status(401).json({ message: `Can't create post. Please login!` });
      return;
    }

    const post = await client.posts.create({
      data: {
        title,
        postImage: imageURL,
        synopsis,
        content,
        userId: createrId,
      },
    });

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
    return;
  } catch (error) {
    console.log("CreatePost Error:", error);
    res.status(500).json({ message: "something went wrong" });
    return;
  }
};

export const GetIndividualPosts = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get posts.Please login!` });
      return;
    }
    const posts = await client.posts.findMany({
      where: {
        userId: createrId,
        isDeleted: false,
      },
      orderBy: { dateCreated: "desc" },
    });
    res.status(201).json({
      message: "Your posts have been retrieved successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const GetAllBlogs = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't see post.Please login!` });
      return;
    }
    const posts = await client.posts.findMany({
      orderBy: { dateCreated: "desc" },
      where: { isDeleted: false },
    });
    res.status(201).json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const GetASpecificPost = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get your post.Please login!` });
      return;
    }
    const { blogId } = req.params;
    const post = await client.posts.findUnique({
      where: { blogId, isDeleted: false },
      include: {
        user: {
          select: {
            profilepicture: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (post) {
      res.status(201).json({
        message: "Successfully retrieved your post",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const UpdateAPost = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get your post.Please login!` });
      return;
    }
    const { title, synopsis, content, postImage } = req.body;
    const { blogId } = req.params;

    const post = await client.posts.findUnique({
      where: { blogId },
    });
    if (post?.userId !== createrId) {
      res.status(300).json({
        message: `You cannot edit another author's post`,
      });
    }
    const updatedPost = await client.posts.update({
      where: { blogId },
      data: { title, synopsis, content, postImage },
    });
    res.status(200).json({
      message: "Post has been updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
    console.log(error);
  }
};

export const DeletePost = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get your post.Please login!` });
      return;
    }

    const { blogId } = req.params;

    const post = await client.posts.findUnique({
      where: { blogId },
    });
    if (post?.userId !== createrId) {
      res.status(300).json({
        message: `You cannot delete another author's post`,
      });
      return;
    }

    await client.posts.update({
      where: { blogId },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({
      Message: "Post deleted successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
    console.log(error);
  }
};
