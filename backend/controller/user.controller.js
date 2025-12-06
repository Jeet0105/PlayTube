import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channel.model.js";
import User from "../model/user.model.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId)
        .select("-password")
        .populate({
            path: "channel",
            select: "name avatar banner description category subscriberCount"
        });

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    return res.status(200).json({
        success: true,
        user
    });
});

export const createChannel = asyncHandler(async (req, res) => {
    const { name, description, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({
            success: false,
            message: "Name and category are required."
        });
    }

    // Check if channel or owner exists
    const existingChannel = await Channel.findOne({
        $or: [{ name: name.trim() }, { owner: req.userId }]
    });

    if (existingChannel) {
        if (existingChannel.name === name.trim()) {
            return res.status(409).json({
                success: false,
                message: "A channel with this name already exists."
            });
        }

        if (String(existingChannel.owner) === String(req.userId)) {
            return res.status(409).json({
                success: false,
                message: "You already have a channel."
            });
        }
    }

    let avatar = "";
    let banner = "";

    // Upload avatar
    if (req.files?.avatar?.[0]?.path) {
        try {
            avatar = await uploadOnCloudinary(req.files.avatar[0].path) || "";
        } catch (error) {
            console.error("Avatar upload error:", error);
        }
    }

    // Upload banner
    if (req.files?.banner?.[0]?.path) {
        try {
            banner = await uploadOnCloudinary(req.files.banner[0].path) || "";
        } catch (error) {
            console.error("Banner upload error:", error);
        }
    }

    const channel = await Channel.create({
        owner: req.userId,
        name: name.trim(),
        description: description?.trim() || "",
        category,
        avatar,
        banner,
    });

    const updateData = {
        channel: channel._id,
        username: name.trim(),
    };

    if (avatar) updateData.profilePictureUrl = avatar;

    await User.findByIdAndUpdate(req.userId, updateData, { new: true });

    return res.status(201).json({
        success: true,
        message: "Channel created successfully.",
        channel
    });
});

export const getChannelData = asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ 
            success: false,
            message: "User ID missing" 
        });
    }

    const channel = await Channel.findOne({ owner: userId })
        .populate("owner", "-password -resetOtp -otpExpires -isOtpVerified")
        .select("+subscriberCount");

    if (!channel) {
        return res.status(404).json({ 
            success: false,
            message: "Channel not found" 
        });
    }

    // Update subscriber count if needed
    if (channel.subscribers && channel.subscriberCount !== channel.subscribers.length) {
        channel.subscriberCount = channel.subscribers.length;
        await channel.save();
    }

    return res.status(200).json({
        success: true,
        message: "Channel retrieved successfully",
        channel,
    });
});