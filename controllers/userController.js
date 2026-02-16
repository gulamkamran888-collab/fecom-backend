import userModel from "../models/userSchema.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // check existing user
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: "Email Already Registered",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // password validation
    // if (password.length < 6) {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Password must be at least 6 characters",
    //   });
    // }

    // password encryption

    const hashPassword = await hash(password, 10);

    // create user
    const newUser = new userModel({ name, email, password: hashPassword });
    await newUser.save();

    // create
    const accesstoken = createAccessToken(newUser._id);
    const refreshtoken = createRefreshToken(newUser._id);

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/user/refreshtoken",
      secure: true, // ✅ Render + Vercel ke liye
      sameSite: "none", // ✅ cross-site cookie
      // sameSite: "lax",
      // secure: false,
    });
    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
      accesstoken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while creating user",
      error: error.message,
    });
  }
};
export const refreshtoken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;

    if (!rf_token)
      return res.status(400).json({ msg: "please Login or Register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
      if (err) return res.status(400).json({ msg: "Invalid refresh token" });
      console.log("REFRESH PAYLOAD 👉", decoded);
      // const accesstoken = createAccessToken({ id: user.id });
      const accesstoken = createAccessToken({ id: decoded.id });
      return res.json({ accesstoken });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
};
export const getUser = async (req, res) => {
  try {
    console.log("GET USER ID 👉", req.user);

    const user = await userModel.findById(req.user).select("-password");

    if (!user) return res.status(400).json({ msg: "User not Found" });

    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user);

    if (!user) return res.status(400).json({ msg: "user does not exist" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "incomplete password" });

    const accesstoken = createAccessToken({ id: user._id });
    const refreshtoken = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/user/refreshtoken",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });
    res.json({
      accesstoken,
      user: {
        role: user.role,
      },
    });
    console.log(accesstoken);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      path: "/user/refreshtoken",
      secure: true,
      sameSite: "none",
    });
    return res.json({ msg: "Log Out" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const addCart = async (req, res) => {
  try {
    console.log("USER 👉", req.user);
    console.log("CART 👉", req.body.cart);

    const user = await userModel.findById(req.user); // ✅ direct id

    if (!user) return res.status(400).json({ msg: "User not found" });

    user.cart = req.body.cart;
    await user.save();

    return res.json({ msg: "Cart saved successfully" });
  } catch (err) {
    console.error("ADD CART ERROR 👉", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.findById(req.user);
    if (!user) return res.status(400).json({ msg: "User not found" });

    // name update
    if (name) user.name = name;

    // email update
    if (email) user.email = email;

    // password update (only if provided)
    if (password) {
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });

      user.password = await hash(password, 10);
    }

    await user.save();

    res.json({ msg: "Profile Updated Successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log(req.body);

//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       // .update(resetToken)
//       .update(req.params.token)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
//     await user.save();

//     // const resetUrl = `https://fstecom.netlify.app/reset-password/${resetToken}`;
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const message = `
//       <h2>Password Reset</h2>
//       <p>You requested password reset</p>
//       <a href="${resetUrl}">Reset Password</a>
//       <p>This link will expire in 15 minutes</p>
//     `;

//     await sendEmail({
//       email: user.email,
//       subject: "Password Reset Request",
//       message,
//     });

//     res.json({ msg: "Reset password link sent to email" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 🔥 PROFESSIONAL EMAIL TEMPLATE HERE
    const message = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
        <h2 style="color:#333;">Password Reset Request</h2>

        <p>Hello ${user.name || "User"},</p>

        <p>You requested to reset your password. Click the button below:</p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${resetUrl}" 
             style="
               background-color:#1976d2;
               color:white;
               padding:12px 25px;
               text-decoration:none;
               border-radius:5px;
               display:inline-block;
               font-weight:bold;
             ">
             Reset Password
          </a>
        </div>

        <p>This link will expire in <strong>15 minutes</strong>.</p>

        <p>If you did not request this, please ignore this email.</p>

        <hr />
        <p style="font-size:12px;color:#777;">
          If the button doesn't work, copy and paste this link in your browser:
          <br />
          ${resetUrl}
        </p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.json({ msg: "Reset password link sent to email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;

    if (!password || password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters",
      });
    }
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Token invalid or expired" });

    user.password = await hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    console.log(req.body, "no body");

    const user = await userModel.findById(req.user);
    if (!user) return res.status(400).json({ msg: "User not found" });

    const { fullName, mobile, pincode, addressLine, city, state, landmark } =
      req.body;

    if (!fullName || !mobile || !pincode || !addressLine || !city || !state) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    user.addresses.push({
      fullName,
      mobile,
      pincode,
      addressLine,
      city,
      state,
      landmark,
    });

    await user.save();

    res.json({
      msg: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
