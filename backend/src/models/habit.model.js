import mongoose, { Schema } from "mongoose";

const habitItemSchema = new Schema(
    {
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
            default: "",
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
    { timestamps: true } // gives createdAt/updatedAt for each habit item
);

const userHabitSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // only one document per user
            index: true,
        },
        habits: {
            type: [habitItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const Habit = mongoose.model("Habit", userHabitSchema);