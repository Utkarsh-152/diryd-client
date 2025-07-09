import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    createDelivery,
    getDeliveriesByUserId,
    getDeliveriesById,
    deleteDeliveryById
} from '../models/delivery.model.js';

export const createDeliveryController = asyncHandler(async (req, res) => {
    const {
        pickupLocation,
        dropOffLocation,
        parcelType,
        vehicleType,
        packageDescription,
        specialInstructions,
        receiverName,
        receiverPhone,
        paymentOption
    } = req.body;

    const userId = req.user?.userId || req.body.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    if (!pickupLocation || !dropOffLocation || !parcelType || !vehicleType) {
        throw new ApiError(400, "pickupLocation, dropOffLocation, parcelType, and vehicleType are required");
    }

    const newDelivery = await createDelivery(req.pool, {
        pickupLocation,
        dropOffLocation,
        parcelType,
        vehicleType,
        packageDescription,
        specialInstructions,
        receiverName,
        receiverPhone,
        paymentOption,
        userId
    });

    return res.status(201).json(
        new ApiResponse(201, newDelivery, "Delivery created successfully")
    );
});

export const getDeliveriesByIdController = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;
    
    if (!deliveryId) {
        throw new ApiError(400, "deliveryId parameter is required");
    }

    const delivery = await getDeliveriesById(req.pool, deliveryId);

    if (!delivery) {
        throw new ApiError(404, "Delivery not found");
    }

    return res.status(200).json(
        new ApiResponse(200, delivery, "Delivery fetched successfully")
    );
});

export const getDeliveriesByUserIdController = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.params.userId || req.body.userId;

    if (!userId) {
    throw new ApiError(401, "Unauthorized: User ID not found");
    }

    const deliveries = await getDeliveriesByUserId(req.pool, userId);

    return res.status(200).json(
        new ApiResponse(200, deliveries, "Deliveries fetched successfully")
    );
});

export const deleteDeliveryByIdController = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;
    
    if (!deliveryId) {
        throw new ApiError(400, "deliveryId parameter is required");
    }

    const deletedDelivery = await deleteDeliveryById(req.pool, deliveryId);

    if (!deletedDelivery) {
        throw new ApiError(404, "Delivery not found or already deleted");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedDelivery, "Delivery deleted successfully")
    );
});