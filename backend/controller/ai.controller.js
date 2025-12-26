import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../middleware/errorHandler.js";
import Channel from "../model/channel.model.js";
import Video from "../model/video.model.js";
import Short from "../model/short.model.js";
import Playlist from "../model/playlist.model.js";
import dotenv from "dotenv";
dotenv.config();

export const searchWithAI = asyncHandler(async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({
            success: false,
            message: "Input is required"
        });
    }

    // 1. Initialize Google Generative AI
    // We remove the explicit { apiVersion: "v1beta" } to use the stable default
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use a modern, supported model name
    // Options: "gemini-2.5-flash" (Recommended), "gemini-2.0-flash", or "gemini-1.5-flash-8b"
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash" 
    });

    const prompt = `You are a search assistant for a video sharing platform.
    The user query is "${input}".
    Your job:
    -If query has typos, correct them.
    -If query has multiple words, break them into meaningful keywords.
    -Return only keywords separated by commas, without any additional text.
    -Do not explain, only return keyword(s).
    -Example: If the user query is "funny cat videos", return "funny, cat, videos".`;

    // 2. AI Content Generation
    const result = await model.generateContent(prompt);
    const aiResponse = result.response;
    const keywordString = aiResponse.text().trim().replace(/[\n\r]+/g, '');

    // 3. Process Keywords into an array
    const searchWords = keywordString.split(',').map((w) => w.trim()).filter(Boolean);

    // 4. Robust MongoDB Regex Query Builder
    const buildRegexQuery = (fields) => {
        const conditions = [];
        searchWords.forEach((word) => {
            fields.forEach((field) => {
                conditions.push({ [field]: { $regex: word, $options: 'i' } });
            });
        });
        return conditions.length > 0 ? { $or: conditions } : null;
    };

    // 5. Database Queries
    const channelQuery = buildRegexQuery(['name', 'description', 'category']);
    const matchedChannels = channelQuery ? await Channel.find(channelQuery).select('_id name avatar') : [];
    const channelIds = matchedChannels.map((channel) => channel._id);

    // Video Search
    const videoQuery = buildRegexQuery(['title', 'description', 'tags']);
    const videoSearchConditions = [];
    if (videoQuery) videoSearchConditions.push(...videoQuery.$or);
    if (channelIds.length > 0) videoSearchConditions.push({ channel: { $in: channelIds } });

    const videos = videoSearchConditions.length > 0
        ? await Video.find({ $or: videoSearchConditions }).populate("channel", "name avatar")
        : [];

    // Shorts Search
    const shortQuery = buildRegexQuery(['title', 'description', 'tags']);
    const shortSearchConditions = [];
    if (shortQuery) shortSearchConditions.push(...shortQuery.$or);
    if (channelIds.length > 0) shortSearchConditions.push({ channel: { $in: channelIds } });

    const shorts = shortSearchConditions.length > 0
        ? await Short.find({ $or: shortSearchConditions }).populate("channel", "name avatar")
        : [];

    // Playlist Search
    const playlistQuery = buildRegexQuery(['title', 'description']);
    const playlistSearchConditions = [];
    if (playlistQuery) playlistSearchConditions.push(...playlistQuery.$or);
    if (channelIds.length > 0) playlistSearchConditions.push({ channel: { $in: channelIds } });

    const playlists = playlistSearchConditions.length > 0
        ? await Playlist.find({ $or: playlistSearchConditions }).populate("channel", "name avatar")
        : [];

    // 6. Final Response
    return res.status(200).json({
        success: true,
        keywordsUsed: searchWords,
        channels: matchedChannels,
        videos,
        shorts,
        playlists
    });
});