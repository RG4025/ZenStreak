import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    logHabit,
    getHabitLogsForHabit,
    getHabitLogsByDate,
} from "../controllers/habitLog.controller.js";

const router = Router();

// Apply JWT verification middleware to all habit log routes
router.use(verifyJWT);

router.route("/")
    .post(logHabit);

router.route("/habit/:habitId")
    .get(getHabitLogsForHabit);

router.route("/date/:dateKey")
    .get(getHabitLogsByDate);

export default router;
