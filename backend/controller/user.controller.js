import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channel.model.js";
import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const createChannel = async (req, res) => {
    try {
        const { name, description, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Name and category are required."
            });
        }

        // Check if channel or owner exists
        const exists = await Channel.findOne({
            $or: [{ name }, { owner: req.userId }]
        });

        if (exists) {
            if (exists.name === name) {
                return res.status(409).json({
                    message: "A channel with this name already exists."
                });
            }

            if (String(exists.owner) === req.userId) {
                return res.status(409).json({
                    message: "You already created a channel."
                });
            }
        }

        // ✅ declare them BEFORE using
        let avatar = "";
        let banner = "";

        // Upload avatar
        if (req.files?.avatar?.[0]?.path) {
            const uploaded = await uploadOnCloudinary(req.files.avatar[0].path);
            avatar = uploaded || "";
        }

        // Upload banner
        if (req.files?.banner?.[0]?.path) {
            const uploaded = await uploadOnCloudinary(req.files.banner[0].path);
            banner = uploaded || "";
        }

        const channel = await Channel.create({
            owner: req.userId,
            name,
            description: description || "",
            category,
            avatar,
            banner,
        });

        const updateData = {
            channel: channel._id,
            username: name,
        };

        if (avatar) updateData.profilePictureUrl = avatar;

        await User.findByIdAndUpdate(req.userId, updateData, { new: true });

        return res.status(201).json({
            message: "Channel created successfully.",
            channel
        });

    } catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({
            message: "Internal server error!!"
        });
    }
};