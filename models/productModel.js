import mongoose from "mongoose";
// models/productModel.js
const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true,
      trim: true,
    },
    // title: String,
    // price: Number,
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },

    description: String,
    content: String,
    images: {
      public_id: String,
      url: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const productModel = mongoose.model("Products", productSchema);

export default productModel;
