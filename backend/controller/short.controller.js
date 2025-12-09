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
    const shorts = await Short.find().sort({ createdAt: -1 });

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