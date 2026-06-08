import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";

const parseBoolean = (value) => value === true || value === "true";

const createHabit = asyncHandler(async (req, res) => {
    const { title, description, startDate, order } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }

    const cleanTitle = title.trim();

    if (cleanTitle.length < 2 || cleanTitle.length > 100) {
        throw new ApiError(400, "Title must be between 2 and 100 characters");
    }

    if (description && description.trim().length > 300) {
        throw new ApiError(400, "Description cannot exceed 300 characters");
    }

    let parsedStartDate = new Date();
    if (startDate) {
        parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            throw new ApiError(400, "Invalid start date format");
        }
    }

    const userId = req.user._id;

    let userHabitDoc = await Habit.findOne({ userId });

    // If no document exists for this user, create one
    if (!userHabitDoc) {
        userHabitDoc = new Habit({
            userId,
            habits: [],
        });
    }

    // Check duplicate title inside the user's habit array
    const duplicateHabit = userHabitDoc.habits.find(
        (h) => h.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (duplicateHabit) {
        throw new ApiError(409, "Habit with this title already exists");
    }

    userHabitDoc.habits.push({
        title: cleanTitle,
        description: description?.trim() || "",
        startDate: parsedStartDate,
        order: typeof order === "number" ? order : 0,
    });

    await userHabitDoc.save();

    const createdHabit = userHabitDoc.habits[userHabitDoc.habits.length - 1];

    return res
        .status(201)
        .json(new ApiResponse(201, createdHabit, "Habit created successfully"));
});

const getHabits = asyncHandler(async (req, res) => {
    const { isArchived } = req.query;

    const userHabitDoc = await Habit.findOne({ userId: req.user._id });

    if (!userHabitDoc) {
        return res.status(200).json(new ApiResponse(200, [], "Habits fetched successfully"));
    }

    let habits = [...userHabitDoc.habits];

    if (isArchived !== undefined) {
        const archivedValue = parseBoolean(isArchived);
        habits = habits.filter((habit) => habit.isArchived === archivedValue);
    }

    habits.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res
        .status(200)
        .json(new ApiResponse(200, habits, "Habits fetched successfully"));
});

const getHabitById = asyncHandler(async (req, res) => {
    const { habitId } = req.params;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const userHabitDoc = await Habit.findOne({
        userId: req.user._id,
        "habits._id": habitId,
    });

    if (!userHabitDoc) {
        throw new ApiError(404, "Habit not found");
    }

    const habit = userHabitDoc.habits.id(habitId);

    return res
        .status(200)
        .json(new ApiResponse(200, habit, "Habit fetched successfully"));
});

const updateHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;
    const { title, description, startDate, isArchived, order } = req.body;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const userHabitDoc = await Habit.findOne({
        userId: req.user._id,
        "habits._id": habitId,
    });

    if (!userHabitDoc) {
        throw new ApiError(404, "Habit not found");
    }

    const habit = userHabitDoc.habits.id(habitId);

    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            throw new ApiError(400, "Title cannot be empty");
        }

        const cleanTitle = title.trim();

        if (cleanTitle.length < 2 || cleanTitle.length > 100) {
            throw new ApiError(400, "Title must be between 2 and 100 characters");
        }

        const duplicateHabit = userHabitDoc.habits.find(
            (h) =>
                h._id.toString() !== habitId &&
                h.title.toLowerCase() === cleanTitle.toLowerCase()
        );

        if (duplicateHabit) {
            throw new ApiError(409, "Habit with this title already exists");
        }

        habit.title = cleanTitle;
    }

    if (description !== undefined) {
        if (description && description.trim().length > 300) {
            throw new ApiError(400, "Description cannot exceed 300 characters");
        }
        habit.description = description?.trim() || "";
    }

    if (startDate !== undefined) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            throw new ApiError(400, "Invalid start date format");
        }
        habit.startDate = parsedStartDate;
    }

    if (isArchived !== undefined) {
        habit.isArchived = parseBoolean(isArchived);
    }

    if (order !== undefined) {
        if (typeof order !== "number") {
            throw new ApiError(400, "Order must be a number");
        }
        habit.order = order;
    }

    await userHabitDoc.save();

    return res
        .status(200)
        .json(new ApiResponse(200, habit, "Habit updated successfully"));
});

const deleteHabit = asyncHandler(async (req, res) => {
    const { habitId } = req.params;

    if (!mongoose.isValidObjectId(habitId)) {
        throw new ApiError(400, "Invalid habit ID");
    }

    const userHabitDoc = await Habit.findOne({
        userId: req.user._id,
        "habits._id": habitId,
    });

    if (!userHabitDoc) {
        throw new ApiError(404, "Habit not found");
    }

    const habit = userHabitDoc.habits.id(habitId);
    if (!habit) {
        throw new ApiError(404, "Habit not found");
    }

    userHabitDoc.habits.pull(habitId);
    await userHabitDoc.save();

    await HabitLog.deleteMany({ habitId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Habit and its logs deleted successfully"));
});

export {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit,
};