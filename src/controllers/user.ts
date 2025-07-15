import { User } from "@prisma/client";
import { Request, Response } from "express";
import client from "../config/prismaclient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface UserRequest extends Request {
  userId?: string;
}
export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password?.trim()
    ) {
      res
        .status(400)
        .json({ message: "All fields must be properly filled in" });
      return;
    }

    const existingUser = await client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      res.status(401).json({ message: "user already exist" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "Account Created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await client.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (!user) {
      res.status(404).json({ message: "Invalid login details" });
      return;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      res.status(401).json({ message: "Invalid login details" });
      return;
    }
    const { id, password: _, datejoined, isDeleted, ...rest } = user;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    res.status(200).json({ message: "login successful", token, user: rest });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const EditDetails = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get your details.Please login!` });
      return;
    }
    const { firstName, lastName, username, profilepicture, email } = req.body;
    const auth = await client.user.update({
      where: { id: createrId },
      data: { firstName, lastName, username, profilepicture, email },
    });
    res.status(200).json({
      message: "Details updated successfully",
      data: auth,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const EditPassword = async (req: UserRequest, res: Response) => {
  try {
    const createrId = req.userId;
    const { newPassword, oldPassword } = req.body;

    if (!createrId) {
      res.status(401).json({ message: "Unauthorized. Please login." });
      return;
    }

    const user = await client.user.findFirst({ where: { id: createrId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(403).json({ message: "Wrong current password." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id: createrId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully." });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const getUser = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await client.user.findFirst({ where: { id: userId } });
    res.status(200).json({ user });
    return;
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
