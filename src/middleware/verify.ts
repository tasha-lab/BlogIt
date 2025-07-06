import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserRequest extends Request {
  userId?: string;
}
export const verify = (req: UserRequest, res: Response, next: NextFunction) => {
  const userheader = req.headers.authorization;

  if (!userheader || !userheader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Please login please" });
    return;
  }
  const token = userheader.split(" ")[1];
  const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  };

  try {
    const extractDetails = verifyToken(token);
    req.userId = extractDetails.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Please login first" });
    console.log(error);
    return;
  }
};
