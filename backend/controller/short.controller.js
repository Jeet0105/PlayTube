import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import Channel from "../model/channel.model.js";
import Short from "../model/short.model.js"


export const createShort = asyncHandler(async (req, res) => {
    const { title, description, tags, channelId } = req.body;

    if (!title || !channelId) {
        return res.status(400).json({
            success: false,
            message: "Title and channel are required"
        });
    }

    const channelData = await Channel.findById(channelId);
    if (!channelData) {
        return res.status(404).json({
            success: false,
            message: "Channel not found"
        });
    }

    let shortUrl = null;

    if (req.file) {
        shortUrl = await uploadOnCloudinary(req.file.path);
    }

    const newShort = await Short.create({
        channel: channelId,
        title,
        description,
        shortUrl,
        tags: tags ? JSON.parse(tags) : []
    });

    await Channel.findByIdAndUpdate(
        channelId,
        { $push: { shorts: newShort._id } },
        { new: true }
    );

    return res.status(201).json(newShort);
});

export const getAllShorts = asyncHandler(async (req, res) => {
    const shorts = await Short.find().sort({ createdAt: -1 }).populate("channel");

    if (shorts.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No shorts available right now"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Shorts retrieved successfully",
        shorts
    });
});

export const toggleLikeShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.userId;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  const short = await Short.findById(shortId).select("likes dislikes");
  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  const hasLiked = short.likes.some(
    id => id.toString() === userId
  );

  let updatedShort;

  if (hasLiked) {
    // Remove like
    updatedShort = await Short.findByIdAndUpdate(
      shortId,
      { $pull: { likes: userId } },
      { new: true }
    ).select("likes dislikes");
  } else {
    // Add like & remove dislike
    updatedShort = await Short.findByIdAndUpdate(
      shortId,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId }
      },
      { new: true }
    ).select("likes dislikes");
  }

  return res.status(200).json({
    success: true,
    message: hasLiked ? "Like removed" : "Video liked",
    short: updatedShort
  });
});

export const toggleDislikeShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.userId;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  const short = await Short.findById(shortId).select("likes dislikes");
  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  const hasDisliked = short.dislikes.some(
    id => id.toString() === userId
  );

  let updatedShort;

  if (hasDisliked) {
    // Remove dislike
    updatedShort = await Short.findByIdAndUpdate(
      shortId,
      { $pull: { dislikes: userId } },
      { new: true }
    ).select("likes dislikes");
  } else {
    // Add dislike & remove like
    updatedShort = await Short.findByIdAndUpdate(
      shortId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId }
      },
      { new: true }
    ).select("likes dislikes");
  }

  return res.status(200).json({
    success: true,
    message: hasDisliked ? "Dislike removed" : "Video disliked",
    short: updatedShort
  });
});

export const toggleSaveShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.userId;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  const short = await Short.findById(shortId).select("saveBy");
  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  const hasSaved = short.saveBy.some(
    id => id.toString() === userId
  );

  const updatedShort = hasSaved
    ? await Short.findByIdAndUpdate(
        shortId,
        { $pull: { saveBy: userId } },
        { new: true }
      ).select("saveBy")
    : await Short.findByIdAndUpdate(
        shortId,
        { $addToSet: { saveBy: userId } },
        { new: true }
      ).select("saveBy");

  return res.status(200).json({
    success: true,
    message: hasSaved ? "Short removed from saved" : "Short saved",
    short: updatedShort
  });
});

export const incrementViewShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  const short = await Short.findByIdAndUpdate(
    shortId,
    { $inc: { views: 1 } },
    { new: true }
  ).select("views");

  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  return res.status(200).json({
    success: true,
    views: short.views,
  });
});

export const addCommentShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Comment message is required." });
  }

  const short = await Short.findById(shortId);
  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  const newComment = {
    author: userId,
    message: message.trim(),
  };

  short.comments.push(newComment);
  await short.save();

  // Populate only the newly added comment
  const populatedShort = await Short.findById(shortId)
    .populate({
      path: "comments.author",
      select: "username profilePictureUrl email",
    })
    .populate({
      path: "comments.replies.author",
      select: "username profilePictureUrl email",
    });

  const addedComment = populatedShort.comments.at(-1);

  return res.status(201).json({
    success: true,
    message: "Comment added",
    comment: addedComment,
    populatedShort
  });
});

export const addReplyShort = asyncHandler(async (req, res) => {
  const { shortId, commentId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  if (!shortId) {
    return res.status(400).json({ message: "ShortId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid ShortId." });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Reply message is required." });
  }

  const short = await Short.findById(shortId);
  if (!short) {
    return res.status(404).json({ message: "Short not found." });
  }

  const comment = short.comments.id(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  const newReply = {
    author: userId,
    message: message.trim(),
  };

  comment.replies.push(newReply);
  await short.save();

  // Populate only the relevant fields for comments and replies
  const populatedShort = await Short.findById(shortId)
    .populate({
      path: "comments.author",
      select: "username profilePictureUrl email",
    })
    .populate({
      path: "comments.replies.author",
      select: "username profilePictureUrl email",
    });

  const addedReply = comment.replies.at(-1);

  return res.status(201).json({
    success: true,
    message: "Reply added",
    reply: addedReply,
  });
});

export const getShortComments = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    return res.status(400).json({ message: "Invalid shortId" });
  }

  const short = await Short.findById(shortId)
    .select("comments")
    .populate({
      path: "comments.author",
      select: "username profilePictureUrl email",
    })
    .populate({
      path: "comments.replies.author",
      select: "username profilePictureUrl email",
    });

  if (!short) {
    return res.status(404).json({ message: "Short not found" });
  }

  return res.status(200).json({
    success: true,
    comments: short.comments,
  });
});

export const getLikedShort = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const likedShorts = await Short.find({ likes: userId })
    .populate("channel", "name avatar")
    .populate("likes", "username")
  
  if (likedShorts.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No liked short found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Liked shorts fetched successfully",
    likedShorts
  });
});

export const getSavedShorts = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const savedShorts = await Short.find({ saveBy: userId })
    .populate("channel", "name avatar")
    .populate("saveBy", "username")

  if (savedShorts.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No saved short found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Saved shorts fetched successfully",
    savedShorts
  });
})