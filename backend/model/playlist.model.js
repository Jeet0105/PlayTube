import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
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
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    thumbnail: {
        type: String,
        default: ""
    },
    video: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    videoCount: {
        type: Number,
        default: 0
    },
    saveBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    visibility: {
        type: String,
        enum: ["public", "unlisted", "private"],
        default: "public"
    }
}, { timestamps: true });

// Indexes for better query performance
playlistSchema.index({ channel: 1 });
playlistSchema.index({ title: "text", description: "text" });
playlistSchema.index({ createdAt: -1 });
playlistSchema.index({ videoCount: -1 });

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;