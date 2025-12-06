import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function() {
        // Password not required for Google OAuth users
        return !this.isGoogleUser;
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include in queries by default
    },
    profilePictureUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    resetOtp: { 
      type: String,
      select: false, // Don't include in queries by default
    },
    otpExpires: { 
      type: Date,
      select: false,
    },
    isOtpVerified: { 
      type: Boolean, 
      default: false,
      select: false,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ channel: 1 });

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetOtp;
  delete obj.otpExpires;
  delete obj.isOtpVerified;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;