import express from "express";
import authAdmin from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";
import uploadCtrl from "../controllers/uploadController.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload", auth, authAdmin, uploadCtrl);

export default uploadRouter;
