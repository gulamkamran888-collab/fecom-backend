import orderModel from "../models/orderModel.js";
import userModel from "../models/userSchema.js";

export const createOrder = async (req, res) => {
  try {
    // const { cart } = req.body;
    const { cart, shippingAddress, paymentMethod } = req.body;

    console.log("REQ.USER 👉", req.user);

    const user = await userModel.findById(req.user);
    console.log(user);

    if (!user) return res.status(400).json({ msg: "User not found" });

    // total calculate
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // const newOrder = new orderModel({
    //   user: req.user,
    //   cart,
    //   total,
    // });
    const newOrder = new orderModel({
      user: req.user,
      cart,
      total,
      shippingAddress,
      paymentMethod,
      status: "Pending",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(user._id, { cart: [] });

    res.json({ msg: "Order placed successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user })
      .populate("user", "name email");

    res.json(orders);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// ADMIN ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ADMIN UPDATE STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await orderModel.findByIdAndUpdate(req.params.id, { status });

    res.json({ msg: "Order status updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const cancleOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    order.deliveryStatus = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const cancleOrder = async (req, res) => {
//   try {
//     // // ✅ Check valid Mongo ID
//     // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     //   return res.status(400).json({ message: "Invalid order ID" });
//     // }

//     const order = await orderModel.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // ✅ Ensure user owns this order
//     if (order.user.toString() !== req.user) {
//       return res.status(403).json({ message: "Unauthorized action" });
//     }

//     // ✅ Only pending orders can be cancelled
//     if (order.status !== "Pending") {
//       return res
//         .status(400)
//         .json({ message: "Only pending orders can be cancelled" });
//     }

//     // ✅ Update status
//     order.status = "Cancelled";
//     order.deliveryStatus = "Cancelled";

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order cancelled successfully",
//       order,
//     });
//   } catch (err) {
//     console.log("CANCEL ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// GET: Single Order Details
export const singleOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
