import { GoogleGenAI } from "@google/genai";
import { asyncHandler } from "../middleware/errorHandler.js";
import Channel from "../model/channel.model.js";
import Video from "../model/video.model.js";
import Short from "../model/short.model.js";
import Playlist from "../model/playlist.model.js";
import dotenv, { populate } from "dotenv";
dotenv.config();

export const searchWithAI = asyncHandler(async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({
            success: false,
            message: "Input is required"
        });
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `You are a search assistant for a video sharing platform.
    The user query is "${input}".
    Your job:
    -If query has typos, correct them.
    -If query has multiple words, break them into meaningful keywords.
    -Return only keywords separated by commas, without any additional text.
    -Do not explain, only return keyword(s).
    -Example: If the user query is "funny cat videos", return "funny, cat, videos".`;

    const response = await ai.chat.completions.create({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    let keyword = (response.text || input).trim().replace(/[\n\r]+/g, '');

    const searchWords = keyword.split(',').map((w) => w.trim()).filter(Boolean);

    const buildRegexQuery = (fields) => {
        return {
            $or: searchWords.map((word) => {
                $or: fields.map((field) => ({
                    [field]: { $regex: word, $options: 'i' }
                }))
            })
        }
    }

    const matchedChannels = await Channel.find(
        buildRegexQuery(['name', 'description', 'category'])
    ).select('_id name avatar');

    const channelIds = matchedChannels.map((channel) => channel._id);

    const videos = await Video.find({
        $or: [
            buildRegexQuery(['title', 'description', 'tags']),
            { channel: { $in: channelIds } }
        ]
    }).populate("channel comments.author comments.replies.author");

    const shorts = await Short.find({
        $or: [
            buildRegexQuery(['title', 'description', 'tags']),
            { channel: { $in: channelIds } }
        ]
    })
        .populate("channel", "name avatar")
        .populate("likes", "username profilePictureUrl")

    const playlists = await Playlist.find({
        $or: [
            buildRegexQuery(['title', 'description']),
            { channel: { $in: channelIds } }
        ]
    })
        .populate("channel", "name avatar")
        .populate({
            path: "video",
            populate: { path: "channel", select: "name avatar" }
        });
    
    return res.status(200).json({
        success: true,
        message: "Search results fetched successfully",
        channels: matchedChannels,
        videos,
        shorts,
        playlists
    });
});