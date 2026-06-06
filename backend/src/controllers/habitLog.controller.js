import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const isValidDateKey = (dateKey) =>
    typeof dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateKey);

const parseBoolean = (value) => value === true || value === "true";

const logHabit = asyncHandler(async (req, res) => {
    const { habitId, dateKey, completed, locked } = req.body;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    if (!isValidDateKey(dateKey)) {
        throw new ApiError(400, "Invalid dateKey format. Expected format: YYYY-MM-DD");
    }

    if (completed === undefined) {
        throw new ApiError(400, "completed status is required");
    }

    // Verify habit ownership (habit is now embedded inside user's Habit document)
    const habitDoc = await Habit.findOne({
        userId: req.user._id,
        "habits._id": habitId,
    });

    if (!habitDoc) {
        throw new ApiError(404, "Habit not found");
    }

    let userLogDoc = await HabitLog.findOne({ userId: req.user._id });

    if (!userLogDoc) {
        userLogDoc = new HabitLog({
            userId: req.user._id,
            logs: [],
        });
    }

    const logIndex = userLogDoc.logs.findIndex(
        (log) =>
            log.habitId.toString() === habitId.toString() &&
            log.dateKey === dateKey
    );

    if (logIndex !== -1) {
        const existingLog = userLogDoc.logs[logIndex];

        if (existingLog.locked) {
            throw new ApiError(400, "Habit log is locked and cannot be modified");
        }

        existingLog.completed = parseBoolean(completed);
        existingLog.completedAt = existingLog.completed ? new Date() : undefined;

        if (locked !== undefined) {
            existingLog.locked = parseBoolean(locked);
        }
    } else {
        userLogDoc.logs.push({
            habitId,
            dateKey,
            completed: parseBoolean(completed),
            completedAt: parseBoolean(completed) ? new Date() : undefined,
            locked: locked !== undefined ? parseBoolean(locked) : false,
        });
    }

    await userLogDoc.save();

    const savedLog =
        logIndex !== -1
            ? userLogDoc.logs[logIndex]
            : userLogDoc.logs[userLogDoc.logs.length - 1];

    return res
        .status(200)
        .json(new ApiResponse(200, savedLog, "Habit log updated successfully"));
});

const getHabitLogsForHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;
    const { startDateKey, endDateKey } = req.query;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    // Verify habit ownership
    const habitDoc = await Habit.findOne({
        userId: req.user._id,
        "habits._id": habitId,
    });

    if (!habitDoc) {
        throw new ApiError(404, "Habit not found");
    }

    if (startDateKey && !isValidDateKey(startDateKey)) {
        throw new ApiError(
            400,
            "Invalid startDateKey format. Expected format: YYYY-MM-DD"
        );
    }

    if (endDateKey && !isValidDateKey(endDateKey)) {
        throw new ApiError(
            400,
            "Invalid endDateKey format. Expected format: YYYY-MM-DD"
        );
    }

    if (startDateKey && endDateKey && startDateKey > endDateKey) {
        throw new ApiError(400, "startDateKey cannot be greater than endDateKey");
    }

    const userLogDoc = await HabitLog.findOne({ userId: req.user._id });

    if (!userLogDoc) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "Habit logs fetched successfully"));
    }

    let logs = userLogDoc.logs.filter(
        (log) => log.habitId.toString() === habitId.toString()
    );

    if (startDateKey) {
        logs = logs.filter((log) => log.dateKey >= startDateKey);
    }

    if (endDateKey) {
        logs = logs.filter((log) => log.dateKey <= endDateKey);
    }

    logs.sort((a, b) => a.dateKey.localeCompare(b.dateKey));

    return res
        .status(200)
        .json(new ApiResponse(200, logs, "Habit logs fetched successfully"));
});

const getHabitLogsByDate = asyncHandler(async (req, res) => {
    const { dateKey } = req.params;

    if (!isValidDateKey(dateKey)) {
        throw new ApiError(400, "Invalid dateKey format. Expected format: YYYY-MM-DD");
    }

    const userLogDoc = await HabitLog.findOne({ userId: req.user._id });

    if (!userLogDoc) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "Habit logs for date fetched successfully"));
    }

    const logs = userLogDoc.logs.filter((log) => log.dateKey === dateKey);

    return res
        .status(200)
        .json(new ApiResponse(200, logs, "Habit logs for date fetched successfully"));
});

export {
    logHabit,
    getHabitLogsForHabit,
    getHabitLogsByDate,
};