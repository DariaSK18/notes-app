import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
})

export const Note = mongoose.model("Note", NoteSchema)