import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createSOS, createSharedLocation } from "../models/sos.model.js";

export const sosController = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.body.userId;
    const { driverLocation, userLocation } = req.body;

    if (!userId || !userLocation) {
        throw new ApiError(400, "userId and userLocation are required");
    }

    const sosEvent = await createSOS(req.pool, { userId, driverLocation, userLocation });

    return res.status(201).json(
        new ApiResponse(201, sosEvent, "SOS event sent successfully")
    );
});

export const shareLocationController = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.body.userId;
    const { userLocation } = req.body;

    if (!userId || !userLocation) {
        throw new ApiError(400, "userId and userLocation are required");
    }

    const shared = await createSharedLocation(req.pool, { userId, userLocation });

    return res.status(201).json(
        new ApiResponse(201, shared, "Location shared successfully")
    );
});