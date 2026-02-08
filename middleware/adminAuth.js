import userModel from "../models/userSchema.js";

const authAdmin = async (req, res, next) => {
  try {
    console.log("ADMIN CHECK USER ID 👉", req.user);

    const user = await userModel.findById(req.user);

    if (!user) return res.status(400).json({ msg: "User not Found" });

    if (user.role !== 1)
      return res.status(403).json({ msg: "Admin access denied" });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default authAdmin;
