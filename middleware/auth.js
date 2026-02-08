import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No token" });

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ msg: "Invalid token" });

      req.user = decoded.id; // ✅ ab id milegi
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default auth;