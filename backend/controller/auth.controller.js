import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";
import sendMail from "../config/sendMail.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const signUp = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "All fields are required" 
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid email format" 
        });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
            success: false,
            message: "Weak password. Use at least 8 characters with letters, numbers, and symbols.",
        });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return res.status(409).json({ 
            success: false,
            message: "User already exists" 
        });
    }

    let photoUrl = null;
    if (req.file?.path) {
        photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username: username.trim(),
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
            success: true,
            message: "User created successfully",
            user: userData,
        });
});


export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "All fields are required" 
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })
        .select("+password") // Include password for comparison
        .populate({
            path: "channel",
            select: "name avatar banner description category"
        });

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    // Check if user has a password (not Google OAuth only)
    if (!user.password) {
        return res.status(401).json({ 
            success: false,
            message: "Please sign in with Google" 
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid credentials" 
        });
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
            success: true,
            message: "User signed in successfully",
            user: userData,
        });
});

export const signOut = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(0),
    });

    return res.status(200).json({ 
        success: true,
        message: "User signed out successfully" 
    });
});

export const googleAuth = asyncHandler(async (req, res) => {
    const { username, email, profilePictureUrl } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false,
            message: "Email is required" 
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let googlePhoto = profilePictureUrl;

    if (googlePhoto) {
        try {
            googlePhoto = await uploadOnCloudinary(googlePhoto);
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            // Continue without photo if upload fails
        }
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        user = await User.create({
            username: username || email.split("@")[0],
            email: normalizedEmail,
            profilePictureUrl: googlePhoto,
            isGoogleUser: true,
        });
    } else {
        // Update profile picture if not set or update username if needed
        if (!user.profilePictureUrl && googlePhoto) {
            user.profilePictureUrl = googlePhoto;
        }
        if (!user.isGoogleUser) {
            user.isGoogleUser = true;
        }
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
            success: true,
            message: "User authenticated with Google successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
            },
        });
});


export const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false,
            message: "Email is required" 
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+resetOtp +otpExpires");

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP + expiry (5 minutes)
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Send email
    await sendMail(normalizedEmail, otp);

    return res.status(200).json({ 
        success: true,
        message: "OTP sent successfully" 
    });
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Validate request
    if (!email || !otp) {
        return res.status(400).json({ 
            success: false,
            message: "Email and OTP are required" 
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with OTP fields
    const user = await User.findOne({ email: normalizedEmail }).select("+resetOtp +otpExpires +isOtpVerified");

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    // Check if OTP exists
    if (!user.resetOtp || !user.otpExpires) {
        return res.status(400).json({ 
            success: false,
            message: "No OTP request found. Please request a new OTP." 
        });
    }

    // Check if OTP expired
    if (user.otpExpires < Date.now()) {
        user.resetOtp = null;
        user.otpExpires = null;
        await user.save();
        return res.status(400).json({ 
            success: false,
            message: "OTP has expired. Please request a new one." 
        });
    }

    // Validate OTP
    if (user.resetOtp !== otp) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid OTP" 
        });
    }

    // OTP is valid — clear OTP fields
    user.resetOtp = null;
    user.otpExpires = null;
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ 
        success: true,
        message: "OTP verified successfully" 
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
        return res.status(400).json({ 
            success: false,
            message: "Email and new password are required" 
        });
    }

    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({
            success: false,
            message: "Weak password. Use at least 8 characters with letters, numbers, and symbols.",
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with OTP verification status
    const user = await User.findOne({ email: normalizedEmail }).select("+isOtpVerified +password");

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    // Ensure OTP has been verified
    if (!user.isOtpVerified) {
        return res.status(400).json({ 
            success: false,
            message: "OTP is not verified. Please verify OTP first." 
        });
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

    return res.status(200).json({ 
        success: true,
        message: "Password reset successfully" 
    });
});