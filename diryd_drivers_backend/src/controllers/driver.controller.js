import { createUser, findUserByEmail, findUserByPhoneNo, findUserById, updateRefreshToken, addServiceType, addVehicleType } from '../models/driver.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateAccessAndRefreshTokens = async (pool, userId) => {
    try {
        const user = await findUserById(pool, userId);
        
        const accessToken = jwt.sign(
            {
                _id: user.userid,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
        
        const refreshToken = jwt.sign(
            {
                _id: user.userid
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        );
        
        await updateRefreshToken(pool, user.userid, refreshToken);
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, phoneno, password } = req.body;
        // Validation
        if (!email || !phoneno || !password) {
            throw new ApiError(400, "All fields are required");
        }
    
        // Check if user already exists
        const existingUserByPhoneNo = await findUserByPhoneNo(req.pgPool, email);
        const existingUserByEmail = await findUserByEmail(req.pgPool, email);
        if (existingUserByEmail) {
            throw new ApiError(409, "User with this email already exists");
        }

        if (existingUserByPhoneNo) {
            throw new ApiError(409, "User with this email already exists");
        }
    
        // Create user
        const user = await createUser(req.pgPool, {
            email,
            password
        });
    
        // Remove sensitive data
        const createdUser = {
            id: user.id,
            userId: user.userid,
            email: user.email,
            createdAt: user.createdat
        };
        return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
    } catch (error) {
        console.log(error.statusCode)
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong", error.errors || [], error.stack);

    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const {  email, password } = req.body;

    if (!(email)) {
        throw new ApiError(400, "Username or email is required");
    }
    
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Find user by email or username
    let user;
    if (email) {
        user = await findUserByEmail(req.pgPool, email);
    } else {
        user = await findUserByUsername(req.pgPool, username);
    }

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.pgPool, user.userid);

    // User object without sensitive information
    const loggedInUser = {
        id: user.id,
        userId: user.userid,
        email: user.email,
        createdAt: user.createdat
    };

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await updateRefreshToken(req.pgPool, req.user.userid, null);
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };
    
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        
        const user = await findUserById(req.pgPool, decodedToken._id);
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        
        if (incomingRefreshToken !== user.refreshtoken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.pgPool, user.userid);
        
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export const handleServiceType = asyncHandler(async (req, res) => {
    try {
        const { serviceType } = req.body;
        const userId = req.user.userid;
    
        if (!serviceType) {
            throw new ApiError(400, "Service type is required");
        }
        

        const updatedUser = await addServiceType(req.pgPool, userId, serviceType);
        
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Service type added successfully")
        );
    } catch (error) {
        console.error("Error in handleServiceType:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong", error.errors || [], error.stack);
    }
});

export const handleVehicleType = asyncHandler(async (req, res) => {
    try {
        const { vehicleType } = req.body;
        const userId = req.user.userid;
  
        if (!vehicleType) {
            throw new ApiError(400, "Vehicle type is required");
        }

        const updatedUser = await addVehicleType(req.pgPool, userId, vehicleType);
        
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Vehicle type added successfully")
        );
    } catch (error) {
        console.error("Error in handleVehicleType:", error);
        throw new ApiError(500, error?.message || "Something went wrong");
    }
});
