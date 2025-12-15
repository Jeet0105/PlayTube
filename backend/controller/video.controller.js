import Video from '../model/video.model.js'
import Channel from '../model/channel.model.js'
import uploadOnCloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, tags, channelId } = req.body;

  if (!title || !channelId || !req.files || !req.files.video || !req.files.thumbnail) {
    return res.status(400).json({
      success: false,
      message: "Title, Video, Thumbnail and channel are required"
    });
  }

  const channelData = await Channel.findById(channelId);
  if (!channelData) {
    return res.status(404).json({
      success: false,
      message: "Channel not found"
    });
  }

  // Upload files
  const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
  const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

  // Parse tags
  let parsedTag = [];
  try {
    if (tags) parsedTag = JSON.parse(tags);
  } catch {
    parsedTag = [];
  }

  const newVideo = await Video.create({
    title,
    channel: channelId,
    description,
    tags: parsedTag,
    videoUrl: uploadVideo,
    thumbnail: uploadThumbnail
  });

  await Channel.findByIdAndUpdate(
    channelId,
    { $push: { video: newVideo._id } },
    { new: true }
  );

  return res.status(201).json(newVideo);
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).populate("channel");

  if (videos.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No videos available right now"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Videos retrieved successfully",
    videos
  });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.userId;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const hasLiked = video.likes.includes(userId);

  if (hasLiked) {
    // Remove like
    video.likes = video.likes.filter(id => id.toString() !== userId);
  } else {
    // Add like and remove dislike if exists
    video.likes.push(userId);
    video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
  }

  await video.save();

  return res.status(200).json({
    success: true,
    message: hasLiked ? "Like removed" : "Video liked",
    video,
  });
});

export const toggleDislike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.userId;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const hasDisliked = video.dislikes.includes(userId);

  if (hasDisliked) {
    // Remove dislike
    video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
  } else {
    // Add dislike and remove like if exists
    video.dislikes.push(userId);
    video.likes = video.likes.filter(id => id.toString() !== userId);
  }

  await video.save();

  return res.status(200).json({
    success: true,
    message: hasDisliked ? "Dislike removed" : "Video disliked",
    video,
  });
});

export const toggleSave = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.userId;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const hasSaved = video.saveBy.some(
    id => id.toString() === userId
  );

  if (hasSaved) {
    video.saveBy = video.saveBy.filter(
      id => id.toString() !== userId
    );
  } else {
    video.saveBy.push(userId);
  }

  await video.save();

  return res.status(200).json({
    success: true,
    message: hasSaved ? "Video removed" : "Video saved",
    video,
  });
});

export const incrementView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  return res.status(200).json({
    success: true,
    video
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Comment message is required." });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const newComment = {
    author: userId,
    message,
  };

  video.comments.push(newComment);
  await video.save();

  return res.status(201).json({
    success: true,
    message: "Comment added",
    comment: video.comments.at(-1),
  });
});

export const addReply = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  if (!videoId) {
    return res.status(400).json({ message: "VideoId is required." });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Comment message is required." });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }

  const comment = video.comments.id(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  comment.replies.push({
    author: userId,
    message
  })
  await video.save();
  return res.status(201).json({
    success: true,
    reply: comment.replies.at(-1),
  });
})