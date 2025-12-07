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

const postSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: [true, "Channel is required"],
        index: true
    },
    image: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minlength: [1, "Content cannot be empty"],
        maxlength: [5000, "Content cannot exceed 5000 characters"]
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    commentCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Indexes for better query performance
postSchema.index({ channel: 1 });
postSchema.index({ content: "text" });
postSchema.index({ createdAt: -1 });
postSchema.index({ likeCount: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;