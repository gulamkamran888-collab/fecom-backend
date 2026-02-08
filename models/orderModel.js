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
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true },
);
const orderModel=mongoose.model("Orders", orderSchema);
export default orderModel
