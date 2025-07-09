import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addShuttle } from "../controllers/shuttle.controller.js";

const router = Router();


router.route("/book-shuttle").post(addShuttle);
router.route("")


export default router; 