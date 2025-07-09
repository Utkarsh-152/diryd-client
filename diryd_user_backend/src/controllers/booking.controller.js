import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createBooking,
    getBookingsByUserId,
    getBookingsById,
    cancelBooking
} from "../models/booking.model.js";

export const createBookingController = asyncHandler(async (req, res) => {
    const {
        tripId,
        seatId,
        from_stop_id,
        to_stop_id
    } = req.body;

    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    if (!tripId || !seatId || !from_stop_id || !to_stop_id) {
        throw new ApiError(400, "tripId, seatId, from_stop_id, and to_stop_id are required");
    }

    const newBooking = await createBooking(req.pool, {
        tripId,
        seatId,
        from_stop_id,
        to_stop_id,
        userId
    });

    return res.status(201).json(
        new ApiResponse(201, newBooking, "Booking created successfully")
    );
});

export const getBookingsByIdController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!bookingId) {
        throw new ApiError(400, "bookingId parameter is required");
    }

    const booking = await getBookingsById(req.pool, bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    };

    return res.status(200).json(
        new ApiResponse(200, booking, "Booking fetched successfully")
    );
});

export const getBookingsByUserIdController = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.params.userId ||req.body.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    const bookings = await getBookingsByUserId(req.pool, userId);

    if (!bookings) {
        throw new ApiError(404, "No bookings found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, bookings, "Bookings fetched successfully")
    );
});

export const cancelBookingController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    
    if (!bookingId) {
        throw new ApiError(400, "bookingId parameter is required");
    };

    const cancelBooking = await cancelBooking(req.pool, bookingId);

    if (!cancelBooking) {
        throw new ApiError(404, "Booking not found or already cancelled");
    }

    return res.status(200).json(
        new ApiResponse(200, cancelBooking, "Booking cancelled successfully")
    );
});
