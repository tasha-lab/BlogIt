import { Router } from "express";
import {
  CreateUser,
  EditDetails,
  EditPassword,
  getUser,
  LoginUser,
} from "../controllers/user";
import { verify } from "../middleware/verify";

const router = Router();

router.post("/", CreateUser);
router.post(`/login`, LoginUser);
router.patch(`/user`, verify, EditDetails);
router.patch("/user/password", verify, EditPassword);
router.get("/profile", verify, getUser);

export default router;
