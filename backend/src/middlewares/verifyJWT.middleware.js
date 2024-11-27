import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    logger.debug("Token: ", token);
    if (!token) {
      logger.error("Unauthorized request");
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug("Decoded Token: ", decodedToken);

    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      logger.error("User not found");
      throw new ApiError(401, "Invalid JWT Token");
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("JWT Verification Error: ", error);
    throw new ApiError(401, error?.message || "Invalid JWT Token");
  }
});

export { verifyJWT };
