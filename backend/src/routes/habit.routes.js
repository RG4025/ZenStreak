import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit,
} from "../controllers/habit.controller.js";

const router = Router();

// Apply JWT verification middleware to all habit routes
router.use(verifyJWT);

router.route("/")
    .post(createHabit)
    .get(getHabits);

router.route("/:habitId")
    .get(getHabitById)
    .patch(updateHabit)
    .delete(deleteHabit);

export default router;
