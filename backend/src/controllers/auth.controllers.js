import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UnverifiedUser } from "../models/unverifiedUser.model.js";
import { generateJWTToken } from "../utils/GenerateToken.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { sendConfirmationMail } from "../utils/sendMail.js";
import logger from "../utils/logger.js";

const uploadPicOnCloudinary = asyncHandler(async (req, res) => {
  logger.debug("******** uploadPicOnCloudinary Function ********");
  const picLocalPath = req.files?.pic[0]?.path;
  console.log("Pic Local Path", picLocalPath);
  if (!picLocalPath) {
    logger.error("No file uploaded");
    throw new ApiError(400, "No file uploaded");
  }

  const pic = await uploadOnCloudinary(picLocalPath);
  console.log("Pic URL", pic);
  if (!pic) {
    logger.error("Failed to upload profile pic");
    throw new ApiError(500, "Failed to upload profile pic");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { url: pic }, "Profile pic uploaded successfully")
    );
});

const registerUser = asyncHandler(async (req, res) => {
  logger.debug("******** registerUser Function ********");
  const { name, email, password, pic } = req.body;
  logger.debug("User Details", name, email, password, pic);
  if (!name || !email || !password) {
    logger.error("All fields are required");
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  logger.debug("Existing User", existingUser);
  if (existingUser) {
    logger.error("User already exists");
    throw new ApiError(400, "User already exists");
  }

  const existingUnverifiedUser = await UnverifiedUser.findOne({ email });
  logger.debug("Existing Unverified User", existingUnverifiedUser);
  if (existingUnverifiedUser) {
    logger.error("Already registered. Please verify your email");
    throw new ApiError(400, "Already registered. Please verify your email");
  }

  const unverifiedUser = await UnverifiedUser.create({
    name,
    email,
    password,
    pic,
  });

  if (!unverifiedUser) {
    logger.error("Failed to create User");
    throw new ApiError(500, "Failed to create User");
  }

  const confirmationMail = await sendConfirmationMail(
    email,
    unverifiedUser._id
  );

  if (!confirmationMail) {
    await UnverifiedUser.deleteOne({ _id: unverifiedUser._id });
    logger.error("Failed to send confirmation mail");
    throw new ApiError(500, "Failed to send confirmation mail");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        name: unverifiedUser.name,
        email: unverifiedUser.email,
        pic: unverifiedUser.pic,
      },
      "Please verify your email to continue"
    )
  );
});

const confirmEmail = asyncHandler(async (req, res) => {
  logger.debug("******** confirmEmail Function ********");
  const { id } = req.params;
  if (!id) {
    logger.error("Invalid request");
    throw new ApiError(400, "Invalid request");
  }
  logger.debug("User ID", id);
  const unverifiedUser = await UnverifiedUser.findById(id);
  if (!unverifiedUser) {
    logger.error("User not found");
    throw new ApiError(404, "User not found");
  }

  const user = await User.create({
    name: unverifiedUser.name,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
    pic: unverifiedUser.pic,
  });

  if (!user) {
    logger.error("Failed to create User");
    throw new ApiError(500, "Failed to create User");
  }
  logger.debug("User Created", user);
  await UnverifiedUser.deleteOne({ _id: unverifiedUser._id });

  return res.status(200).send("Email confirmed. You can now login");
});

const loginUser = asyncHandler(async (req, res) => {
  logger.debug("******** loginUser Function ********");
  const { email, password } = req.body;
  if (!email || !password) {
    logger.error("All fields are required");
    throw new ApiError(400, "All fields are required");
  }

  logger.debug("User Details", email, password);

  const user = await User.findOne({ email });

  if (!user) {
    logger.error("User does not exist");
    throw new ApiError(401, "User does not exist");
  }

  logger.debug("User Found", user);

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateJWTToken(user._id),
        },
        "User logged in successfully"
      )
    );
  }
  logger.error("Invalid email or password");
  throw new ApiError(401, "Invalid email or password");
});

export { uploadPicOnCloudinary, registerUser, confirmEmail, loginUser };
