import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userSchema.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ✅ COUNTS
    const totalOrders = await orderModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    // ✅ TOTAL REVENUE
    const orders = await orderModel.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    // ✅ RECENT ORDERS
    const recentOrders = await orderModel
      .find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      recentOrders,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export default getDashboardStats;
