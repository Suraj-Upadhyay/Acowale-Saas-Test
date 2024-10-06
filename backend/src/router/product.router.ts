import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct
} from "../controller/product.controller";

const router = Router();

router.route("/").post(authorize, createProduct);
router.route("/:id").get(authorize, getProduct);
router.route("/:id").put(authorize, updateProduct);
router.route("/:id").delete(authorize, deleteProduct);

router.route("/all").get(authorize);
