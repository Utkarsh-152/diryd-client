import { Router } from 'express';
import { logoutMerchant, sendOtp, verifyOtpAndLogin, updateProfileController } from '../controllers/merchant.controller.js';
import { createMerchantDeliveryController, getMerchantDeliveryByIdController, getMerchantDeliveriesByMerchantIdController, deleteMerchantDeliveryByIdController } from '../controllers/merchant_delivery.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/sendOtp').post(sendOtp);
router.route('/verifyOtp').post(verifyOtpAndLogin);
router.route('/logout').post(verifyJWT, logoutMerchant);
router.route('/profile').put(verifyJWT, updateProfileController);

router.route('/delivery').post(verifyJWT, createMerchantDeliveryController)
router.route('/delivery/:deliveryId')
    .get(verifyJWT, getMerchantDeliveryByIdController)
    .delete(verifyJWT, deleteMerchantDeliveryByIdController);
router.route('/deliveries/merchant/:merchantId').get(verifyJWT, getMerchantDeliveriesByMerchantIdController);

export default router;
