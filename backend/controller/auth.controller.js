import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase();

        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message: "Weak password. Use at least 8 characters with letters, numbers, and symbols.",
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        let photoUrl = null;
        if (req.file?.path) {
            photoUrl = await uploadOnCloudinary(req.file.path);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email: normalizedEmail,
            password: hashedPassword,
            profilePictureUrl: photoUrl,
        });

        const token = generateToken(newUser._id);

        const userData = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePictureUrl: newUser.profilePictureUrl,
        };

        return res
            .status(201)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                message: "User created successfully",
                user: userData,
            });

    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePictureUrl: user.profilePictureUrl,
        };

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                message: "User signed in successfully",
                user: userData,
            });

    } catch (error) {
        console.error("SignIn Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const signOut = (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(0),
        });

        return res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        console.error("SignOut Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
