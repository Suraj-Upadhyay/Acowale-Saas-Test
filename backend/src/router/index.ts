import { Router } from "express";
import user from "./user.router";
import product from "./product.router";

const router = Router();

router.use("/user", user);
router.use("/product", product);

export default router;
