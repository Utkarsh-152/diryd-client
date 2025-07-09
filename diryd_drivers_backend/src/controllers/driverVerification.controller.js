import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addVehicleRC, addAdhaarCard, addDrivingLicence } from '../models/driverVerification.model.js';

export const handleVehicleRC = asyncHandler(async (req, res) => {
    try {
        const { vehicleRC } = req.file?.path;
        const userId = req.user.userid;
    
        if(!vehicleRC) {
            throw new ApiError(400, "Avatar file is required")
        }
        
        const updatedUser = await addVehicleRC(req.pgPool, userId, vehicleRC);
        
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Vehicle RC added successfully")
        );
    } catch (error) {
        console.error("Error in handlevehicleRC:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong in add Vehicle RC", error.errors || [], error.stack);
    }
});

export const handleAdhaarCard = asyncHandler(async (req, res) => {
    try {
        const { adhaarCard } = req.file?.path;
        const userId = req.user.userid;
    
        if(!adhaarCard) {
            throw new ApiError(400, "Avatar file is required")
        }
        
        const updatedUser = await addAdhaarCard(req.pgPool, userId, adhaarCard);
        
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Adhaar Card added successfully")
        );
    } catch (error) {
        console.error("Error in handleAdhaarCard:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong in add Adhaar Card", error.errors || [], error.stack);
    }
});

export const handleDrivingLicence = asyncHandler(async (req, res) => {
    try {
        const { drivingLicence } = req.file?.path;
        const userId = req.user.userid;
    
        if(!drivingLicence) {
            throw new ApiError(400, "Avatar file is required")
        }
        
        const updatedUser = await addDrivingLicence(req.pgPool, userId, drivingLicence);
        
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Adhaar Card added successfully")
        );
    } catch (error) {
        console.error("Error in handle driving license:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong in add Adhaar Card", error.errors || [], error.stack);
    }
});