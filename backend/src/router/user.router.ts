import { Router } from "express";
import { login, signup, logout } from "../controller/user.controller";
import {
  loginValidator,
  signupValidator
} from "../middleware/validators.middleware";

const router = Router();

router.route("/login").post(loginValidator, login);
router.route("/signup").post(signupValidator, signup);
router.route("/logout").post(logout);

export default router;
