import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const logHabit = asyncHandler(async (req, res) => {
    const { habitId, dateKey, completed, locked } = req.body;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    if (!dateKey || typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        throw new ApiError(400, "Invalid dateKey format. Expected format: YYYY-MM-DD");
    }

    if (completed === undefined) {
        throw new ApiError(400, "completed status is required");
    }

    // Verify habit ownership
    const habit = await Habit.findOne({
        _id: habitId,
        userId: req.user._id,
    });

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    // Find existing log
    let log = await HabitLog.findOne({
        userId: req.user._id,
        habitId,
        dateKey,
    });

    if (log) {
        if (log.locked) {
            throw new ApiError(400, "Habit log is locked and cannot be modified");
        }

        log.completed = Boolean(completed);
        log.completedAt = log.completed ? new Date() : undefined;

        if (locked !== undefined) {
            log.locked = Boolean(locked);
        }

        await log.save();
    } else {
        log = await HabitLog.create({
            userId: req.user._id,
            habitId,
            dateKey,
            completed: Boolean(completed),
            completedAt: Boolean(completed) ? new Date() : undefined,
            locked: locked !== undefined ? Boolean(locked) : false,
        });
    }

    return res.status(200).json(
        new ApiResponse(200, log, "Habit log updated successfully")
    );
});

const getHabitLogsForHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;
    const { startDateKey, endDateKey } = req.query;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    // Verify habit ownership
    const habit = await Habit.findOne({
        _id: habitId,
        userId: req.user._id,
    });

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    const query = {
        userId: req.user._id,
        habitId,
    };

    if (startDateKey || endDateKey) {
        query.dateKey = {};
        if (startDateKey) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateKey)) {
                throw new ApiError(400, "Invalid startDateKey format. Expected format: YYYY-MM-DD");
            }
            query.dateKey.$gte = startDateKey;
        }
        if (endDateKey) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(endDateKey)) {
                throw new ApiError(400, "Invalid endDateKey format. Expected format: YYYY-MM-DD");
            }
            query.dateKey.$lte = endDateKey;
        }
    }

    const logs = await HabitLog.find(query).sort({ dateKey: 1 });

    return res.status(200).json(
        new ApiResponse(200, logs, "Habit logs fetched successfully")
    );
});

const getHabitLogsByDate = asyncHandler(async (req, res) => {
    const { dateKey } = req.params;

    if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        throw new ApiError(400, "Invalid dateKey format. Expected format: YYYY-MM-DD");
    }

    const logs = await HabitLog.find({
        userId: req.user._id,
        dateKey,
    });

    return res.status(200).json(
        new ApiResponse(200, logs, "Habit logs for date fetched successfully")
    );
});

export {
    logHabit,
    getHabitLogsForHabit,
    getHabitLogsByDate,
};
