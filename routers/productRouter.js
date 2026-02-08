import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";
const productRoute = express.Router();

productRoute.get("/products", getProduct);
productRoute.get("/products/:id", getProductById);
productRoute.post("/products", auth, authAdmin, createProduct);
productRoute.delete("/products/:id", auth, authAdmin, deleteProduct);
productRoute.put("/products/:id", auth, authAdmin, updateProduct);

export default productRoute;
