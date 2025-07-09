import { createMerchantWithPhone, findMerchantByPhone, saveAccessToken, updateMerchantProfile } from "../models/merchant.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";

const otpStore = new Map();

export const sendOtp = asyncHandler(async (req, res) => {
    const { phoneNo } = req.body;
    if (!phoneNo) {
        res.status(400);
        throw new Error('Phone number is required');
    }

    const otp = '1234';
    otpStore.set(phoneNo, otp);
    console.log(`Sending OTP ${otp} to phone number ${phoneNo}`);
    res.status(200).json({ message: `OTP sent to ${phoneNo}`, otp });
})

export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
    const { phoneNo, otp } = req.body;
    const pool = req.pgPool;
    console.log(pool);
    if (!phoneNo || !otp) {
        res.status(400);
        throw new Error('Phone number and OTP are required');
    }

    const storedOtp = otpStore.get(phoneNo);
    if (!storedOtp || storedOtp !== otp) {
        res.status(401);
        throw new Error('Invalid OTP or phone number');
    }

    otpStore.delete(phoneNo);

    let merchant = await findMerchantByPhone(pool, phoneNo);

    if (merchant) {
        const token = generateAccessToken(merchant.merchantId);
        const updatedMerchant = await saveAccessToken(pool, merchant.merchantId, token);
        return res.status(200).json({ message: 'Merchant already exists, logged in', merchant: updatedMerchant, accessToken: token });
    }

    const newMerchant = await createMerchantWithPhone(pool, phoneNo);
    const token = generateAccessToken(newMerchant.merchantId);
    const updatedNewMerchant = await saveAccessToken(pool, newMerchant.merchantId, token);
    return res.status(201).json({ message: 'New merchant created', merchant: updatedNewMerchant, accessToken: token });
});

export const logoutMerchant = asyncHandler(async (req, res) => {
    console.log("object");
    const merchantId = req.merchant.merchantId;
    console.log("Logging out merchant:", merchantId);

    await saveAccessToken(req.pgPool, merchantId, null);

    res.clearCookie('accessToken');

    res.status(200).json({ message: 'Merchant logged out successfully' });
})

export const updateProfileController = asyncHandler(async (req, res) => {
    const merchantId = req.merchant.merchantId;
    const profileData = req.body;

    const updated = await updateMerchantProfile(req.pgPool, merchantId, profileData);

    res.status(200).json({ message: "Profile updated", merchant: updated });
});