import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Channel owner is required"],
        unique: true, // One channel per user
    },
    name: {
        type: String,
        required: [true, "Channel name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Channel name must be at least 3 characters"],
        maxlength: [50, "Channel name cannot exceed 50 characters"],
    },
    description: {
        type: String,
        default: "",
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: [
                "Music", "Gaming", "News", "Movies", "Sports", "Learning",
                "Fashion & Beauty", "TV Shows", "Trending", "Live", "Comedy",
                "Entertainment", "Education", "Science & Technology", "Art",
                "Cooking", "Travel", "Autos & Vehicles", "Other"
            ],
            message: "Invalid category",
        },
    },
    banner: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    subscriberCount: {
        type: Number,
        default: 0,
    },
    video: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    shorts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Short",
    }],
    playlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
    }],
    communityPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
}, { timestamps: true });

// Indexes for better query performance
channelSchema.index({ owner: 1 });
channelSchema.index({ name: 1 });
channelSchema.index({ category: 1 });
channelSchema.index({ subscriberCount: -1 }); // For sorting by popularity

// Virtual for subscriber count (can be used instead of array length)
channelSchema.virtual("subscriberCountVirtual").get(function() {
    return this.subscribers?.length || 0;
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;