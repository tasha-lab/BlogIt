import { Router } from "express";
import { CreateUser, LoginUser } from "../controllers/user";

const router = Router();

router.post("/", CreateUser);
router.post(`/login`, LoginUser);

export default router;
