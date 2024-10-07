import { Router } from "express";
import {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controller/product.controller";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

router.get("/all", authorize, getAllProducts); // GET /product/all

router.post("/", authorize, createProduct); // POST /product
router.get("/:id", authorize, getProduct); // GET /product/:id
router.put("/:id", authorize, updateProduct); // PUT /product/:id
router.delete("/:id", authorize, deleteProduct); // DELETE /product/:id

export default router;
