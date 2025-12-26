import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Reply cannot exceed 1000 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"]
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const shortSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: [true, "Channel is required"],
        index: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        default: "",
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    shortUrl: {
        type: String,
        required: [true, "Short URL is required"]
    },
    thumbnail: {
        type: String,
        default: ""
    },
    duration: {
        type: Number, // Duration in seconds (shorts are typically 60 seconds or less)
        default: 0,
        max: [60, "Shorts cannot exceed 60 seconds"]
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"]
    }],
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    saveBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    visibility: {
        type: String,
        enum: ["public", "unlisted", "private"],
        default: "public"
    },
    comments: [commentSchema],
    commentCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Indexes for better query performance
shortSchema.index({ channel: 1 });
shortSchema.index({ title: "text", description: "text" });
shortSchema.index({ views: -1 });
shortSchema.index({ createdAt: -1 });
shortSchema.index({ likeCount: -1 });
shortSchema.index({ tags: 1 });
shortSchema.index({ title: "text", description: "text" });

const Short = mongoose.model("Short", shortSchema);
export default Short;