import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id || decoded._id).select(
        "-password",
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User belonging to this token no longer exists",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("Auth verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing. Please sign in.",
    });
  }
};

export default { protect };
