import { User } from "@prisma/client";
import { Request, Response } from "express";
import client from "../config/prismaclient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password }: User = req.body;
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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    res.status(200).json({ message: "login successful", token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
