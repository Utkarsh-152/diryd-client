import { createUserWithPhone, findUserByPhone } from "../models/user.model.js";
import {asyncHandler} from '../utils/asyncHandler.js'
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { saveAccessToken } from "../models/user.model.js";

const otpStore = new Map(); // In-memory store: phoneNo => otp

export const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNo } = req.body;
  if (!phoneNo) {
    res.status(400);
    throw new Error('Phone number is required');
  }

  const otp = '1234'; // Hardcoded OTP for demo
  otpStore.set(phoneNo, otp); // Save OTP linked to phoneNo
  console.log(`Sending OTP ${otp} to phone number ${phoneNo}`);

  res.status(200).json({ message: `OTP sent to ${phoneNo}`, otp });
});

export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const { phoneNo, otp } = req.body;
  const pool = req.pgPool;
  console.log(pool)
  if (!phoneNo || !otp) {
    res.status(400);
    throw new Error('Phone number and OTP are required');
  }

  // Check if OTP matches the one stored for this phone number
  const storedOtp = otpStore.get(phoneNo);
  if (!storedOtp || storedOtp !== otp) {
    res.status(401);
    throw new Error('Invalid OTP or phone number');
  }

  // OTP is correct for this phoneNo, clear it from store (optional)
  otpStore.delete(phoneNo);

  // Check user in DB
  let user = await findUserByPhone(pool, phoneNo);

  if (user) {
  const token = generateAccessToken(user.userid);
  const updatedUser = await saveAccessToken(pool, user.userid, token);
  return res.status(200).json({ message: 'User already exists, logged in', user: updatedUser, accessToken: token });
}

const newUser = await createUserWithPhone(pool, phoneNo);
const token = generateAccessToken(newUser.userid);
const updatedNewUser = await saveAccessToken(pool, newUser.userid, token);
res.status(201).json({ message: 'User registered and logged in', user: updatedNewUser, accessToken: token });

});

export const logoutUser = asyncHandler(async (req, res) => {
    console.log("object")
    const userId = req.user.userid; // correctly get the user ID
    console.log("Logging out user:", userId);

    // Nullify the stored token in DB
    await saveAccessToken(req.pgPool, userId, null);

    // Clear the token cookie (if using cookies)
    res.clearCookie('accessToken');

    res.status(200).json({ message: 'User logged out successfully' });
});