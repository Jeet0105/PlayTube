import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channel.model.js";
import User from "../model/user.model.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import Video from "../model/video.model.js"
import Short from "../model/short.model.js"
import mongoose from "mongoose";

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
        .populate("video")
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

export const getAllChannelData = asyncHandler(async (req, res) => {
    const channels = await Channel.find()
        .populate({
            path: "owner",
            select: "username profilePictureUrl channel"
        })
        .populate("video")
        .populate("shorts")
        .populate({
            path: "communityPosts",
            populate: {
                path: "channel",
                model: "Channel"
            }
        })
        .populate({
            path: "playlist",
            populate: {
                path: "video",
                model: "Video",
                populate: {
                    path: "channel",
                    model: "Channel"
                }
            }
        })

    if (!channels.length) {
        return res.status(404).json({
            success: false,
            message: "No channels found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Channels fetched successfully",
        channels,
    });
});

export const getSubscribedData = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const subscribedChannels = await Channel.find({ subscribers: userId })
        .populate({
            path: "video",
            populate: { path: "channel", select: "name avatar" }
        })
        .populate({
            path: "shorts",
            populate: { path: "channel", select: "name avatar" }
        })
        .populate({
            path: "playlist",
            populate: { path: "channel", select: "name avatar" },
            populate: { path: "video", populate: { path: "channel" } }
        })
        .populate({
            path: "communityPosts",
            populate: { path: "channel", select: "name avatar" }
        })

    if (!subscribedChannels || subscribedChannels.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No channel subscribed"
        });
    }

    const videos = subscribedChannels.flatMap((ch => ch.video));
    const shorts = subscribedChannels.flatMap((ch => ch.shorts));
    const posts = subscribedChannels.flatMap((ch => ch.communityPosts));
    const playlist = subscribedChannels.flatMap((ch => ch.playlist));

    return res.status(200).json({
        success: true,
        message: "Retrived Sucessfully",
        subscribedChannels,
        videos,
        shorts,
        posts,
        playlist
    })
});

export const addHistory = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { contentId, contentType } = req.body;

    if (!userId)
        return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!["Video", "Short"].includes(contentType))
        return res.status(400).json({ success: false, message: "Invalid contentType" });

    if (!mongoose.Types.ObjectId.isValid(contentId))
        return res.status(400).json({ success: false, message: "Invalid contentId" });

    const objectId = new mongoose.Types.ObjectId(contentId);
    const Model = contentType === "Video" ? Video : Short;

    const content = await Model.findById(objectId);
    if (!content)
        return res.status(404).json({ success: false, message: `${contentType} not found` });

    await User.updateOne(
        { _id: userId },
        [
            {
                $set: {
                    history: {
                        $let: {
                            vars: { hist: { $ifNull: ["$history", []] } },
                            in: {
                                $concatArrays: [
                                    [
                                        {
                                            contentId: objectId,
                                            contentType,
                                            watchedAt: new Date()
                                        }
                                    ],
                                    {
                                        $filter: {
                                            input: "$$hist",
                                            as: "item",
                                            cond: {
                                                $not: {
                                                    $and: [
                                                        { $eq: ["$$item.contentId", objectId] },
                                                        { $eq: ["$$item.contentType", contentType] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ],
        { updatePipeline: true }
    );

    return res.status(200).json({
        success: true,
        message: "Added to history"
    });
});

export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId)
        .populate({
            path: "history.contentId",
            populate: {
                path: "channel",
                select: "name avatar",
            },
        })
        .select("history")
        .lean();

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const history = Array.isArray(user?.history) ? user.history : [];

    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );

    return res.status(200).json({
        success: true,
        message: "History fetched",
        userHistory: sortedHistory,
    });
});

// H = history size
// L = liked + saved count
// V = total videos in DB
// S = total shorts in DB
// Rv = recommended videos returned
// Rs = recommended shorts returned
// O(H + L + Rv + Rs) for fetching data and processing
// O(V) + O(S) in worst case for remaining content fetch
export const getRecommendedContent = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId)
        .populate("history.contentId", "title tags")
        .lean();

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    /* -------------------- helpers -------------------- */

    const STOP_WORDS = new Set([
        "the", "to", "is", "and", "of", "in", "for", "on", "with", "how"
    ]);

    const extractKeywords = (texts = []) =>
        texts
            .flatMap(t => t.toLowerCase().split(/\s+/))
            .filter(w => w.length > 3 && !STOP_WORDS.has(w));

    /* -------------------- history -------------------- */

    const history = Array.isArray(user.history) ? user.history : [];

    const historyTitles = history
        .map(h => h.contentId?.title)
        .filter(Boolean);

    const historyTags = history.flatMap(h => h.contentId?.tags || []);

    /* -------------------- liked & saved -------------------- */

    const [
        likedVideos,
        savedVideos,
        likedShorts,
        savedShorts
    ] = await Promise.all([
        Video.find({ likes: userId }).select("_id tags"),
        Video.find({ saveBy: userId }).select("_id tags"),
        Short.find({ likes: userId }).select("_id tags"),
        Short.find({ saveBy: userId }).select("_id tags")
    ]);

    /* -------------------- exclude interacted IDs -------------------- */

    const interactedVideoIds = [
        ...history.filter(h => h.contentType === "Video").map(h => h.contentId?._id),
        ...likedVideos.map(v => v._id),
        ...savedVideos.map(v => v._id)
    ].filter(Boolean);

    const interactedShortIds = [
        ...history.filter(h => h.contentType === "Short").map(h => h.contentId?._id),
        ...likedShorts.map(s => s._id),
        ...savedShorts.map(s => s._id)
    ].filter(Boolean);

    /* -------------------- keywords -------------------- */

    const rawKeywords = [
        ...extractKeywords(historyTitles),
        ...historyTags
    ];

    const keywords = [...new Set(rawKeywords)].slice(0, 10);

    /* -------------------- recommended queries -------------------- */

    const videoRecommendQuery = {
        _id: { $nin: interactedVideoIds },
        visibility: "public",
        ...(keywords.length && {
            $or: [
                { tags: { $in: keywords } },
                { $text: { $search: keywords.join(" ") } }
            ]
        })
    };

    const shortRecommendQuery = {
        _id: { $nin: interactedShortIds },
        ...(keywords.length && { tags: { $in: keywords } })
    };

    /* -------------------- fetch recommended -------------------- */

    const [recommendedVideos, recommendedShorts] = await Promise.all([
        Video.find(videoRecommendQuery)
            .sort({ createdAt: -1 })
            .select("title thumbnail channel views likeCount createdAt")
            .populate("channel", "name avatar"),

        Short.find(shortRecommendQuery)
            .sort({ createdAt: -1 })
            .select("title channel views createdAt")
            .populate("channel", "name avatar")
    ]);

    /* -------------------- remaining content -------------------- */

    const recommendedVideoIds = recommendedVideos.map(v => v._id);
    const recommendedShortIds = recommendedShorts.map(s => s._id);

    const remainingVideoQuery = {
        _id: {
            $nin: [...interactedVideoIds, ...recommendedVideoIds]
        },
        visibility: "public"
    };

    const remainingShortQuery = {
        _id: {
            $nin: [...interactedShortIds, ...recommendedShortIds]
        }
    };

    const [remainingVideos, remainingShorts] = await Promise.all([
        Video.find(remainingVideoQuery)
            .sort({ createdAt: -1 })
            .select("title thumbnail channel views likeCount createdAt")
            .populate("channel", "name avatar"),

        Short.find(remainingShortQuery)
            .sort({ createdAt: -1 })
            .select("title channel views createdAt")
            .populate("channel", "name avatar")
    ]);

    /* -------------------- response -------------------- */

    res.status(200).json({
        success: true,
        message: "Recommended content fetched",
        data: {
            recommendedVideos,
            recommendedShorts,
            remainingVideos,
            remainingShorts
        },
        usedKeywords: keywords
    });
});
