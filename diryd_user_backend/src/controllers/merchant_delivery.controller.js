import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    createMerchantDelivery,
    getMerchantDeliveriesByMerchantId,
    getMerchantDeliveryById,
    deleteMerchantDeliveryById
} from '../models/merchant_delivery.model.js';

export const createMerchantDeliveryController = asyncHandler(async (req, res) => {
    const {
        pickupLocation,
        receiverName,
        receiverPhone,
        deliveryAddress,
        parcelType,
        vehicleType,
        specialInstructions,
        estimatedPrice
    } = req.body;

    const merchantId = req.merchant?.merchantId || req.body.merchantId;
    if (!merchantId) {
        throw new ApiError(401, "Unauthorized: Merchant ID not found");
    }

    if (!pickupLocation || !receiverName || !receiverPhone || !deliveryAddress || !parcelType || !vehicleType || !estimatedPrice) {
        throw new ApiError(400, "pickupLocation, receiverName, receiverPhone, deliveryAddress, parcelType, vehicleType, and estimatedPrice are required");
    }

    const newDelivery = await createMerchantDelivery(req.pgPool, {
        merchantId,
        pickupLocation,
        receiverName,
        receiverPhone,
        deliveryAddress,
        parcelType,
        vehicleType,
        specialInstructions,
        estimatedPrice
    });

    return res.status(201).json(
        new ApiResponse(201, newDelivery, "Merchant delivery created successfully")
    );
});

export const getMerchantDeliveryByIdController = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;

    if (!deliveryId) {
        throw new ApiError(400, "deliveryId parameter is required");
    }

    const delivery = await getMerchantDeliveryById(req.pgPool, deliveryId);

    if (!delivery) {
        throw new ApiError(404, "Delivery not found");
    }

    return res.status(200).json(
        new ApiResponse(200, delivery, "Merchant delivery fetched successfully")
    );
});

export const getMerchantDeliveriesByMerchantIdController = asyncHandler(async (req, res) => {
    const merchantId = req.merchant?.merchantId || req.params.merchantId || req.body.merchantId;

    if (!merchantId) {
        throw new ApiError(401, "Unauthorized: Merchant ID not found");
    }

    const deliveries = await getMerchantDeliveriesByMerchantId(req.pgPool, merchantId);

    return res.status(200).json(
        new ApiResponse(200, deliveries, "Merchant deliveries fetched successfully")
    );
});

export const deleteMerchantDeliveryByIdController = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;

    if (!deliveryId) {
        throw new ApiError(400, "deliveryId parameter is required");
    }

    const deletedDelivery = await deleteMerchantDeliveryById(req.pgPool, deliveryId);

    if (!deletedDelivery) {
        throw new ApiError(404, "Delivery not found or already deleted");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedDelivery, "Merchant delivery deleted successfully")
    );
});