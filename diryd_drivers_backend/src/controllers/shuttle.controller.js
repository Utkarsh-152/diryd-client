import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addShuttleBooking } from '../models/shuttle.model.js';

export const addShuttle = asyncHandler(async (req, res) => {
    try {
        const { vehicletype, timeSlot, startPoint, endPoint, seats } = req.body;
    
        if(!vehicletype || !timeSlot || !startPoint || endPoint || !seats) {
            throw new ApiError(400, "Insuficient details please try again!")
        }
        
        const bookedShuttle = await addShuttleBooking(req.pgPool, vehicletype, timeSlot, startPoint, endPoint, seats);
        
        return res.status(200).json(
            new ApiResponse(200, bookedShuttle, "shuttle is booked successfully")
        );
    } catch (error) {
        console.error("Error in addShuttle:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong in add shuttle", error.errors || [], error.stack);
    }
});