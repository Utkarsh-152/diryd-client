import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
  createSchedule,
  getScheduleById,
  getSchedulesByUserId,
  deleteScheduleById
} from '../models/schedule.model.js';

export const createScheduleController = asyncHandler(async (req, res) => {
  const {
    leavingFrom,
    goingTo,
    date,
    time,
    distanceKm,
    transportType,
    passengerCount,
    isReturn,
    returnDate,
    returnTime,
    estimatedPrice
  } = req.body;

  const userId = req.user?.userId || req.body.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User ID not found");
  }

  // Validate required fields (add more as needed)
  if (!leavingFrom || !goingTo || !date || !time) {
    throw new ApiError(400, "leavingFrom, goingTo, date, and time are required");
  }

  const newSchedule = await createSchedule(req.pool, {
    leavingFrom,
    goingTo,
    date,
    time,
    distanceKm,
    transportType,
    passengerCount,
    isReturn,
    returnDate,
    returnTime,
    estimatedPrice,
    userId
  });

  return res.status(201).json(
    new ApiResponse(201, newSchedule, "Schedule created successfully")
  );
});

export const getScheduleByIdController = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;

  if (!scheduleId) {
    throw new ApiError(400, "scheduleId parameter is required");
  }

  const schedule = await getScheduleById(req.pool, scheduleId);

  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }

  return res.status(200).json(
    new ApiResponse(200, schedule, "Schedule fetched successfully")
  );
});

export const getSchedulesByUserIdController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.params.userId || req.body.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User ID not found");
  }

  const schedules = await getSchedulesByUserId(req.pool, userId);

  return res.status(200).json(
    new ApiResponse(200, schedules, "Schedules fetched successfully")
  );
});

export const deleteScheduleByIdController = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;

  if (!scheduleId) {
    throw new ApiError(400, "scheduleId parameter is required");
  }

  const deletedSchedule = await deleteScheduleById(req.pool, scheduleId);

  if (!deletedSchedule) {
    throw new ApiError(404, "Schedule not found or already deleted");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedSchedule, "Schedule deleted successfully")
  );
});
