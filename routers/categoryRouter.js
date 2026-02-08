import express from "express";
import {
  createCategory,
  getcategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
const categoryRouter = express.Router();
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

categoryRouter.get("/category", getcategory);
categoryRouter.post("/category", auth, authAdmin, createCategory);
categoryRouter.delete("/category/:id", auth, authAdmin, deleteCategory);
categoryRouter.put("/category/:id", auth, authAdmin, updateCategory);

export default categoryRouter;
