import uploadOnCloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import Channel from "../model/channel.model.js";
import Post from "../model/post.model.js";

export const CreatePost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const file = req.file;
    if (!content?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Post content is required.",
        });
    }

    const channel = await Channel.findOne({ owner: req.userId });
    if (!channel) {
        return res.status(404).json({
            success: false,
            message: "Channel not found.",
        });
    }

    let imageUrl;

    if (file) {
        const uploadedImage = await uploadOnCloudinary(file.path);

        imageUrl = uploadedImage;
    }

    const post = await Post.create({
        channel: channel._id,
        image: imageUrl,
        content,
    });

    await Channel.findByIdAndUpdate(
        channel._id,
        { $push: { communityPosts: post._id } },
        { new: true }
    );

    return res.status(201).json({
        success: true,
        message: "Post created successfully.",
        post,
    });
});

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({
            path: "channel",
            select: "-__v"
        })
        .populate({
            path: "comments.author",
            select: "-password -resetOtp -otpExpires -isOtpVerified -__v"
        })
        .populate({
            path: "comments.replies.author",
            select: "-password -resetOtp -otpExpires -isOtpVerified -__v"
        });

    return res.status(200).json({
        success: true,
        message: posts.length ? "Posts retrieved successfully." : "No posts available.",
        posts
    });
});

export const toggleLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const userId = req.userId;

    if (!postId) {
        return res.status(400).json({ success: false, message: "PostId is required." });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Ensure arrays exist
    post.likes = Array.isArray(post.likes) ? post.likes : [];
    post.dislikes = Array.isArray(post.dislikes) ? post.dislikes : [];

    // Check if user has already liked
    const hasLiked = post.likes.some((id) => id && id.toString() === userId.toString());
    let liked;

    if (hasLiked) {
        // Remove like safely
        post.likes = post.likes.filter((id) => id && id.toString() !== userId.toString());
        liked = false;
    } else {
        // Add like safely
        post.likes.push(userId);
        // Optional: remove from dislikes
        post.dislikes = post.dislikes.filter((id) => id && id.toString() !== userId.toString());
        liked = true;
    }

    await post.save();

    return res.status(200).json({
        success: true,
        liked,
        likeCount: post.likes.length,
    });
});

export const addCommentPost = asyncHandler(async (req, res) => {
    const { postId, message } = req.body;
    const userId = req.userId;

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "PostId is required."
        });
    }

    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Comment message is required."
        });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    const newComment = {
        author: userId,
        message: message.trim()
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId)
        .populate({
            path: "comments.author",
            select: "username profilePictureUrl email"
        })
        .populate({
            path: "comments.replies.author",
            select: "username profilePictureUrl email"
        });

    const latestComment = populatedPost.comments[populatedPost.comments.length - 1];

    return res.status(201).json({
        success: true,
        message: "Comment added successfully.",
        comment: latestComment,
        populatedPost
    });
});

export const addReplyPost = asyncHandler(async (req, res) => {
    const { postId, commentId, message } = req.body;
    const userId = req.userId;

    if (!postId || !commentId) {
        return res.status(400).json({
            success: false,
            message: "PostId and CommentId are required."
        });
    }

    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Reply message is required."
        });
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found."
        });
    }

    comment.replies.push({
        author: userId,
        message: message.trim()
    });

    await post.save();

    const populatedPost = await Post.findById(postId)
        .populate({
            path: "comments.author",
            select: "username profilePictureUrl email"
        })
        .populate({
            path: "comments.replies.author",
            select: "username profilePictureUrl email"
        });

    return res.status(201).json({
        success: true,
        message: "Reply added successfully.",
        reply: comment.replies[comment.replies.length - 1],
        populatedPost
    });
});