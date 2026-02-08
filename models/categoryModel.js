// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//   },
//   { timestamps: true },
// );
// const categoryModel = mongoose.model("Category", categorySchema);
// export default categoryModel;

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String, // image URL
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
