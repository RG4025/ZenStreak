import mongoose, { Schema } from "mongoose";

const habitLogSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        habitId: {
            type: Schema.Types.ObjectId,
            ref: "Habit",
            required: true,
            index: true,
        },
        dateKey: {
            type: String,
            required: true,
            index: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
        locked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

habitLogSchema.index(
    { userId: 1, habitId: 1, dateKey: 1 },
    { unique: true }
);

export const HabitLog = mongoose.model("HabitLog", habitLogSchema);