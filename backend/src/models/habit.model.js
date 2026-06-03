import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 300,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

habitSchema.index({ userId: 1, title: 1 }, { unique: true });

export const Habit = mongoose.model("Habit", habitSchema);