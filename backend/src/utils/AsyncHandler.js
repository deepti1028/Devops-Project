import logger from "./logger.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    logger.error("Error in AsyncHandler: ", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };
