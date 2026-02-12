import express from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { createRazorpayOrder } from "../controllers/paymentController.js";

const orderRoute = express.Router();

/* USER */
orderRoute.post("/order", auth, createOrder); // place order
orderRoute.get("/history", auth, getUserOrders); // my orders
orderRoute.post("/payment/create-order", auth, createRazorpayOrder);

/* ADMIN */
orderRoute.get("/order", auth, authAdmin, getAllOrders); // all orders
orderRoute.patch("/order/:id", auth, authAdmin, updateOrderStatus);

export default orderRoute;
