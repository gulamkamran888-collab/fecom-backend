// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
//     name: { type: String },
//     email: { type: String },
//     cart: { type: Array },
//     total: { type: Number },
//     status: { type: String, default: "Pending" },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Orders", orderSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    cart: {
      type: Array,
      default: [],
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    shippingAddress: {
      fullName: String,
      mobile: String,
      pincode: String,
      addressLine: String,
      city: String,
      state: String,
      landmark: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },

    deliveryStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;
