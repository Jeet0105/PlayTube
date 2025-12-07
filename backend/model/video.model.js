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

const videoSchema = new mongoose.Schema({
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
        maxlength: [5000, "Description cannot exceed 5000 characters"]
    },
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"]
    },
    duration: {
        type: Number, // Duration in seconds
        default: 0
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
videoSchema.index({ channel: 1 });
videoSchema.index({ title: "text", description: "text" });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ likeCount: -1 });

const Video = mongoose.model("Video", videoSchema);
export default Video;