import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createHabit = asyncHandler(async (req, res) => {
    const { title, description, startDate, order } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }

    if (title.trim().length < 2 || title.trim().length > 100) {
        throw new ApiError(400, "Title must be between 2 and 100 characters");
    }

    if (description && description.trim().length > 300) {
        throw new ApiError(400, "Description cannot exceed 300 characters");
    }

    // Check if habit with same title already exists for this user
    const existingHabit = await Habit.findOne({
        userId: req.user._id,
        title: title.trim(),
    });

    if (existingHabit) {
        throw new ApiError(409, "Habit with this title already exists");
    }

    let parsedStartDate;
    if (startDate) {
        parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            throw new ApiError(400, "Invalid start date format");
        }
    }

    const habit = await Habit.create({
        userId: req.user._id,
        title: title.trim(),
        description: description?.trim() || "",
        startDate: parsedStartDate || undefined,
        order: typeof order === "number" ? order : 0,
    });

    return res.status(201).json(
        new ApiResponse(201, habit, "Habit created successfully")
    );
});

const getHabits = asyncHandler(async (req, res) => {
    const { isArchived } = req.query;

    const query = { userId: req.user._id };

    if (isArchived !== undefined) {
        query.isArchived = isArchived === "true";
    }

    const habits = await Habit.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, habits, "Habits fetched successfully")
    );
});

const getHabitById = asyncHandler(async (req, res) => {
    const { habitId } = req.params;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const habit = await Habit.findOne({
        _id: habitId,
        userId: req.user._id,
    });

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    return res.status(200).json(
        new ApiResponse(200, habit, "Habit fetched successfully")
    );
});

const updateHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;
    const { title, description, startDate, isArchived, order } = req.body;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const habit = await Habit.findOne({
        _id: habitId,
        userId: req.user._id,
    });

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            throw new ApiError(400, "Title cannot be empty");
        }
        if (title.trim().length < 2 || title.trim().length > 100) {
            throw new ApiError(400, "Title must be between 2 and 100 characters");
        }

        // Check unique constraint if title changes
        if (title.trim() !== habit.title) {
            const existingHabit = await Habit.findOne({
                userId: req.user._id,
                title: title.trim(),
            });
            if (existingHabit) {
                throw new ApiError(409, "Habit with this title already exists");
            }
            habit.title = title.trim();
        }
    }

    if (description !== undefined) {
        if (description.trim().length > 300) {
            throw new ApiError(400, "Description cannot exceed 300 characters");
        }
        habit.description = description.trim();
    }

    if (startDate !== undefined) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            throw new ApiError(400, "Invalid start date format");
        }
        habit.startDate = parsedStartDate;
    }

    if (isArchived !== undefined) {
        habit.isArchived = Boolean(isArchived);
    }

    if (order !== undefined) {
        if (typeof order !== "number") {
            throw new ApiError(400, "Order must be a number");
        }
        habit.order = order;
    }

    await habit.save();

    return res.status(200).json(
        new ApiResponse(200, habit, "Habit updated successfully")
    );
});

const deleteHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const habit = await Habit.findOne({
        _id: habitId,
        userId: req.user._id,
    });

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    // Delete the habit itself
    await habit.deleteOne();

    // Cascade delete all associated logs
    await HabitLog.deleteMany({ habitId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Habit and its logs deleted successfully")
    );
});

export {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit,
};
