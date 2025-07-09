import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    handleVehicleType,
    handleServiceType,
    refreshAccessToken 
} from "../controllers/driver.controller.js";
import { handleVehicleRC,
         handleAdhaarCard
 } from "../controllers/driverVerification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/addService").patch(verifyJWT, handleServiceType);
router.route("/addVehicle").patch(verifyJWT, handleVehicleType);
router.route("/addVehicleRC").patch(verifyJWT,upload.single('vehiclerc'), handleVehicleRC);
router.route("/addAdhaar").patch(verifyJWT,upload.single('adhaarCard'), handleAdhaarCard);


export default router; 