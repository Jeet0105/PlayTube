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

export const updateChannel = asyncHandler(async (req, res) => {
    const { name, description, category } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!name || !category) {
        return res.status(400).json({
            success: false,
            message: "Name and category are required."
        });
    }

    // Find the user's channel
    const channel = await Channel.findOne({ owner: userId });

    if (!channel) {
        return res.status(404).json({
            success: false,
            message: "Channel not found. Please create a channel first."
        });
    }

    // Check if name is being changed and if it conflicts with another channel
    const trimmedName = name.trim();
    if (channel.name !== trimmedName) {
        const nameExists = await Channel.findOne({
            name: trimmedName,
            _id: { $ne: channel._id } // Exclude current channel
        });

        if (nameExists) {
            return res.status(409).json({
                success: false,
                message: "A channel with this name already exists."
            });
        }
    }

    // Store original avatar to check if it changed
    const originalAvatar = channel.avatar;

    // Handle avatar upload (only if new file is provided)
    let avatar = channel.avatar; // Keep existing avatar by default
    if (req.files?.avatar?.[0]?.path) {
        try {
            const uploadedAvatar = await uploadOnCloudinary(req.files.avatar[0].path);
            if (uploadedAvatar) {
                avatar = uploadedAvatar;
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            // Keep existing avatar if upload fails
        }
    }

    // Handle banner upload (only if new file is provided)
    let banner = channel.banner; // Keep existing banner by default
    if (req.files?.banner?.[0]?.path) {
        try {
            const uploadedBanner = await uploadOnCloudinary(req.files.banner[0].path);
            if (uploadedBanner) {
                banner = uploadedBanner;
            }
        } catch (error) {
            console.error("Banner upload error:", error);
            // Keep existing banner if upload fails
        }
    }

    // Update channel
    channel.name = trimmedName;
    channel.description = description?.trim() || "";
    channel.category = category.trim();
    channel.avatar = avatar;
    channel.banner = banner;

    await channel.save();

    // Update user's username if channel name changed
    const updateUserData = {
        username: trimmedName,
    };

    // Update user's profile picture if avatar changed
    if (avatar && avatar !== originalAvatar) {
        updateUserData.profilePictureUrl = avatar;
    }

    await User.findByIdAndUpdate(userId, updateUserData, { new: true });

    // Populate owner for response
    await channel.populate("owner", "-password -resetOtp -otpExpires -isOtpVerified");

    return res.status(200).json({
        success: true,
        message: "Channel updated successfully.",
        channel
    });
});

export const toggleSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.body;
    const userId = req.userId;

    if (!channelId) {
        return res.status(400).json({ message: "ChannelId is required." });
    }

    const channel = await Channel.findById(channelId)
        .populate("owner", "-password -resetOtp -otpExpires -isOtpVerified");

    if (!channel) {
        return res.status(404).json({ message: "Channel not found." });
    }

    if (channel.owner._id.equals(userId)) {
        return res.status(400).json({ message: "Cannot subscribe to your own channel" });
    }

    const isSubscribed = channel.subscribers.includes(userId);

    isSubscribed
        ? channel.subscribers.pull(userId)
        : channel.subscribers.addToSet(userId);

    await channel.save();

    return res.status(200).json({
        success: true,
        subscribed: !isSubscribed,
        message: isSubscribed ? "Unsubscribed" : "Subscribed",
        channel
    });
});
