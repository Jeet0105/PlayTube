import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";
import sendMail from "../config/sendMail.js";

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

        const user = await User.findOne({ email: normalizedEmail })
            .populate({
                path: "channel",
                select: "name avatar banner description category"
            });

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
            bio: user.bio,
            channel: user.channel || null
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

export const googleAuth = async (req, res) => {
    try {
        const { username, email, profilePictureUrl } = req.body;
        const normalizedEmail = email.toLowerCase();

        let googlePhoto = profilePictureUrl;

        if (googlePhoto) {
            try {
                googlePhoto = await uploadOnCloudinary(googlePhoto);
            } catch (err) {
                console.log("Cloudinary upload error:", err);
            }
        }

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                username,
                email: normalizedEmail,
                profilePictureUrl: googlePhoto,
            });
        } else if (!user.profilePictureUrl && googlePhoto) {
            user.profilePictureUrl = googlePhoto;
            await user.save();
        }

        const token = generateToken(user._id);

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                message: "User authenticated with Google successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePictureUrl: user.profilePictureUrl,
                },
            });
    } catch (error) {
        console.error("GoogleAuth Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP + expiry (5 minutes)
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        // Send email
        await sendMail(normalizedEmail, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Send OTP Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate request
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const normalizedEmail = email.toLowerCase();

        // Find user
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP exists
        if (!user.resetOtp || !user.otpExpires) {
            return res.status(400).json({ message: "No OTP request found" });
        }

        // Check if OTP expired
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Validate OTP
        if (user.resetOtp != otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP is valid — clear OTP fields
        user.resetOtp = null;
        user.otpExpires = null;
        user.isOtpVerified = true;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const normalizedEmail = email.toLowerCase();

        // Find user
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure OTP has been verified
        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "OTP is not verified" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        user.password = hashedPassword;

        // Clear OTP-related fields
        user.isOtpVerified = false;
        user.resetOtp = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};