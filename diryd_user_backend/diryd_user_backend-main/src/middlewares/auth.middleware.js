import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findUserById } from "../models/user.model.js"; // Make sure this is correct



export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("verifyJWT middleware called");

  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("Token missing");
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodedToken);

    // ✅ Use req.pool instead of req.pgPool
    const user = await findUserById(req.pgPool, decodedToken.userId);


    if (!user) {
      console.log("User not found for userId:", decodedToken.userId);
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    throw new ApiError(401, "Invalid access token");
  }
});
