import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createEmergencyContact,
    getEmergencyContactsByUserId
} from "../models/emergency.model.js";

export const createEmergencyContactController = asyncHandler(async (req, res) => {
    const { contactName, contactPhone } = req.body;
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    if (!contactName || !contactPhone) {
        throw new ApiError(400, "contactName and contactPhone are required");
    }

    const newContact = await createEmergencyContact(req.pool, {
        userId,
        contactName,
        contactPhone
    });

    return res.status(201).json(
        new ApiResponse(201, newContact, "Emergency contact created successfully")
    );
});

export const getEmergencyContactsByUserIdController = asyncHandler(async (req, res) => {
    const userId = req.user?.userId || req.params.userId || req.body.userId;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    const contacts = await getEmergencyContactsByUserId(req.pool, userId);

    return res.status(200).json(
        new ApiResponse(200, contacts, "Emergency contacts fetched successfully")
    );
}
);