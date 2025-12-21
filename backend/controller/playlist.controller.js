import Playlist from "../model/playlist.model.js";
import Channel from "../model/channel.model.js";
import Video from "../model/video.model.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
    const { title, description, thumbnail, videoIds, visibility } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Playlist title is required",
        });
    }

    // Find channel and ensure it exists
    const channel = await Channel.findOne({ owner: req.userId });
    if (!channel) {
        return res.status(404).json({
            success: false,
            message: "Channel not found",
        });
    }
    
    // Ensure all videos exist and belong to the channel
    if (videoIds?.length) {
        const videos = await Video.countDocuments({
            _id: { $in: videoIds },
            channel: channel._id,
        });

        if (videos !== videoIds.length) {
            return res.status(404).json({
                success: false,
                message: "Some videos not found in your channel",
            });
        }
    }

    // Create playlist
    const playlist = await Playlist.create({
        channel: channel._id,
        title,
        description,
        thumbnail,
        visibility,
        video: videoIds,
    });

    // Add playlist to channel
    channel.playlist.push(playlist._id);
    await channel.save();

    res.status(201).json({
        success: true,
        message: "Playlist created successfully",
        playlist,
    });
});

export const toggleSavePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.body;
  const userId = req.userId;

  if (!playlistId) {
    return res.status(400).json({ message: "PlaylistId is required." });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "PlayList not found." });
  }

  const hasSaved = playlist.saveBy.some(
    id => id.toString() === userId
  );

  if (hasSaved) {
    playlist.saveBy = playlist.saveBy.filter(
      id => id.toString() !== userId
    );
  } else {
    playlist.saveBy.push(userId);
  }

  await playlist.save();

  return res.status(200).json({
    success: true,
    message: hasSaved ? "Playlist removed" : "Playlist saved",
    playlist,
  });
});