import express from "express";
import {
  addAddress,
  addCart,
  createUser,
  forgotPassword,
  getUser,
  login,
  logout,
  refreshtoken,
  resetPassword,
  updateProfile,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.get("/info", auth, getUser);
userRouter.get("/refreshtoken", refreshtoken);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.patch("/addcart", auth, addCart);
userRouter.put("/profile", auth, updateProfile);
userRouter.post("/forgot-password", forgotPassword);
userRouter.put("/reset-password/:token", resetPassword);
userRouter.patch("/addaddress", auth, addAddress);

export default userRouter;
