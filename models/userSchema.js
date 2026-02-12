import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    cart: { type: Array, default: [] },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    addresses: [
      {
        fullName: String,
        mobile: String,
        pincode: String,
        addressLine: String,
        city: String,
        state: String,
        landmark: String,
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("Users", userSchema);
export default userModel;
