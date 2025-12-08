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
