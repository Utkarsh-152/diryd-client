import { Router } from "express";
import {  logoutUser, sendOtp, verifyOtpAndLogin } from "../controllers/user.controller.js";
import { createScheduleController, getScheduleByIdController, getScheduleByUserIdController, deleteScheduleByIdController } from "../controllers/schedule.controller.js";
import { createDeliveryController, getDeliveriesByIdController, getDeliveriesByUserIdController, deleteDeliveryByIdController } from "../controllers/delivery.controller.js";
import { createBookingController, getBookingsByIdController, getBookingsByUserIdController, cancelBookingController } from "../controllers/booking.controller.js";
import { createEmergencyContactController, getEmergencyContactsByUserIdController } from "../controllers/emergency.controller.js";
import { sosController, shareLocationController } from "../controllers/sos.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/sentOtp').post(sendOtp)
router.route('/verifyOtp').post(verifyOtpAndLogin)
router.route('/logout').post(verifyJWT,logoutUser)

router.route('/schedule').post(verifyJWT, createScheduleController)
router.route('/schedule/:scheduleId')
    .get(verifyJWT, getScheduleByIdController)
    .delete(verifyJWT, deleteScheduleByIdController)
router.route('/schedules/user/:userId').get(verifyJWT, getScheduleByUserIdController)

router.route('/delivery').post(verifyJWT, createDeliveryController)
router.route('/delivery/:deliveryId')
    .get(verifyJWT, getDeliveriesByIdController)
    .delete(verifyJWT, deleteDeliveryByIdController)
router.route('/deliveries/user/:userId').get(verifyJWT, getDeliveriesByUserIdController)


router.route('/booking').post(verifyJWT, createBookingController)
router.route('/booking/:bookingId')
    .get(verifyJWT, getBookingsByIdController)
    .delete(verifyJWT, cancelBookingController)
router.route('/bookings/user/:userId').get(verifyJWT, getBookingsByUserIdController)

router.route('/emergency').post(verifyJWT, createEmergencyContactController)
router.route('/emergency/user/:userId').get(verifyJWT, getEmergencyContactsByUserIdController)

router.route('/sos').post(verifyJWT, sosController);
router.route('/shareLocation').post(verifyJWT, shareLocationController);

export default router