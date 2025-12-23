import { useState, useEffect } from "react";
import logo from "../../../public/logo.png";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageShell from "../../component/PageShell";
import SurfaceCard from "../../component/SurfaceCard";

function UpdateChannel() {
    const { channelData } = useSelector(state => state.user);
    const [step, setStep] = useState(1);

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [banner, setBanner] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Pre-fill form with existing channel data
    useEffect(() => {
        if (channelData) {
            setChannelName(channelData.name || "");
            setDescription(channelData.description || "");
            setCategory(channelData.category || "");
            setAvatarPreview(channelData.avatar || null);
            setBannerPreview(channelData.banner || null);
        }
    }, [channelData]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBanner(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateChannel = async () => {
        if (!channelData) {
            toast.error("Channel data not found");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", channelName.trim());
        formData.append("description", description.trim());
        formData.append("category", category.trim());
        
        // Only append files if they were changed
        if (avatar) formData.append("avatar", avatar);
        if (banner) formData.append("banner", banner);

        try {
            const res = await api.put(API_ENDPOINTS.USER.UPDATE_CHANNEL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                toast.success(res.data.message || "Channel updated successfully");
                navigate("/viewchannel");
            }
        } catch (error) {
            // Error is handled by axios interceptor
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Redirect if no channel data
    if (!channelData) {
        return (
            <PageShell contentClassName="flex items-center justify-center min-h-screen">
                <SurfaceCard size="md" heading="No Channel Found" subheading="You need to create a channel first.">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-gray-400 text-center">
                            You don't have a channel to update. Please create one first.
                        </p>
                        <button
                            onClick={() => navigate("/createchannel")}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                        >
                            Create Channel
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-[#272727] hover:bg-[#3a3a3a] text-white py-3 rounded-2xl font-semibold transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </SurfaceCard>
            </PageShell>
        );
    }

    const headings = {
        1: "Update Appearance",
        2: "Channel Preview",
        3: "Update Details",
    };

    const descriptions = {
        1: "Update your profile picture and channel name.",
        2: "Review your channel preview and continue.",
        3: "Update banner, description, and category for your channel.",
    };

    const inputClasses =
        "w-full bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition";

  return (
        <PageShell contentClassName="flex items-center justify-center min-h-screen">
            <SurfaceCard
                size="md"
                heading={headings[step]}
                subheading={descriptions[step]}
            >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <img src={logo} alt="Logo" className="w-6" />
                        <span className="font-semibold text-white/80">Step {step} of 3</span>
                    </div>
                    {step > 1 ? (
                        <button
                            className="hover:text-white flex items-center gap-2 text-gray-400 text-sm transition"
                            onClick={prevStep}
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                    ) : (
                        <button
                            className="hover:text-white text-gray-400 text-sm transition"
                            onClick={() => navigate("/viewchannel")}
                        >
                            Back to Channel
                        </button>
                    )}
                </div>

                {/* Step Progress Indicator */}
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                step >= num ? "bg-gradient-to-r from-orange-500 to-pink-500 w-8" : "bg-gray-700 w-1.5"
                            }`}
                        />
                    ))}
                </div>

                {/* -------- STEP 1 -------- */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center">
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer flex flex-col items-center group"
                            >
                                <div className="w-28 h-28 rounded-full border-2 border-white/15 bg-[#1c1c1c] overflow-hidden flex items-center justify-center group-hover:border-orange-500 transition">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-5xl text-gray-500" />
                                    )}
                                </div>
                                <span className="text-orange-400 text-sm mt-3 font-medium">
                                    {avatarPreview ? "Change Avatar" : "Upload Avatar"}
                                </span>
                            </label>

                            <input
                                type="file"
                                id="avatar"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            {channelData.avatar && !avatarPreview && (
                                <p className="text-xs text-gray-500 mt-1">Current avatar will be kept</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm text-gray-300 font-medium">
                                Channel Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter channel name"
                                className={inputClasses}
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={!channelName || loading}
                            onClick={nextStep}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* -------- STEP 2 -------- */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center p-6 bg-[#1c1c1c]/50 rounded-2xl border border-white/5">
                            <div className="w-24 h-24 rounded-full border-2 border-white/15 bg-[#1c1c1c] overflow-hidden flex items-center justify-center mb-4">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Channel avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-4xl text-gray-500" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold">{channelName || "Unnamed Channel"}</h3>
                            <p className="text-sm text-gray-400 mt-1">Channel Preview</p>
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                        >
                            Continue & Update Details
                        </button>
                    </div>
                )}

                {/* -------- STEP 3 -------- */}
                {step === 3 && (
                    <div className="space-y-6">
                        {/* Banner Upload */}
                        <div className="space-y-4">
                            <label className="text-sm text-gray-300 font-medium">
                                Banner Image
                            </label>
                            <label
                                htmlFor="banner"
                                className="cursor-pointer block bg-[#1c1c1c] border border-white/10 rounded-2xl h-36 flex items-center justify-center text-gray-400 hover:border-orange-500 transition overflow-hidden"
                            >
                                {bannerPreview ? (
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm">Click to upload or change banner image</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="banner"
                                className="hidden"
                                accept="image/*"
                                onChange={handleBannerChange}
                            />
                            {channelData.banner && !bannerPreview && (
                                <p className="text-xs text-gray-500">Current banner will be kept</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm text-gray-300 font-medium">
                                Channel Description
                            </label>
                            <textarea
                                placeholder="Tell viewers about your channel..."
                                rows={4}
                                className={`${inputClasses} resize-none`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm text-gray-300 font-medium">
                                Channel Category
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Gaming, Music, Education"
                                className={inputClasses}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={!description || !category || loading}
                            onClick={handleUpdateChannel}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <LoadingSpinner size={20} color="#fff" />
                            ) : (
                                "Save & Update Channel"
                            )}
                        </button>
                    </div>
                )}
            </SurfaceCard>
        </PageShell>
    );
}

export default UpdateChannel;
