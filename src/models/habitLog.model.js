import mongoose, { Schema } from "mongoose";

const habitLogItemSchema = new Schema(
    {
        habitId: {
            type: Schema.Types.ObjectId,
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

const habitLogSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        logs: {
            type: [habitLogItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// Keep one document per user
habitLogSchema.index({ userId: 1 }, { unique: true });

export const HabitLog = mongoose.model("HabitLog", habitLogSchema);