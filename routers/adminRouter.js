import express from "express";
import { getDashboardStats } from "../controllers/adminCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard/stats", auth, authAdmin, getDashboardStats);

export default adminRouter;
