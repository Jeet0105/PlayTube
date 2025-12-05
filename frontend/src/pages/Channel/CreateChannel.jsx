import { useState } from "react";
import logo from "../../../public/logo.png";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import PageShell from "../../component/PageShell";
import SurfaceCard from "../../component/SurfaceCard";

function CreateChannel() {
    const [step, setStep] = useState(1);

    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleCreateChannel = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("name", channelName);
        formData.append("description", description);
        formData.append("category", category);
        if (avatar) formData.append("avatar", avatar);
        if (banner) formData.append("banner", banner);
        console.log(avatar);
        console.log(banner);
            
        try {
            const res = await axios.post(
                `${serverUrl}/api/v1/user/createchannel`,
                formData,
                { withCredentials: true }
            );

            toast.success(res?.data?.message || "Channel created successfully");
            navigate("/");

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Channel not created! Try again");
        } finally {
            setLoading(false);
        }
    };

    const headings = {
        1: "Your Appearance",
        2: "Your Channel",
        3: "Channel Details",
    };

    const descriptions = {
        1: "Set your profile picture and channel name.",
        2: "Review your channel preview and continue.",
        3: "Add banner, description, and category to complete your channel.",
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
                            onClick={() => navigate("/")}
                        >
                            Back to Home
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
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-5xl text-gray-500" />
                                    )}
                                </div>
                                <span className="text-orange-400 text-sm mt-3 font-medium">
                                    Upload Avatar
                                </span>
                            </label>

                            <input
                                type="file"
                                id="avatar"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
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
                                {avatar ? (
                                    <img
                                        src={URL.createObjectURL(avatar)}
                                        alt="Channel avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-4xl text-gray-500" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold">{channelName}</h3>
                            <p className="text-sm text-gray-400 mt-1">Channel Preview</p>
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                        >
                            Continue & Setup Details
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
                                {banner ? (
                                    <img
                                        src={URL.createObjectURL(banner)}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm">Click to upload banner image</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="banner"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setBanner(e.target.files[0])}
                            />
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
                            onClick={handleCreateChannel}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <ClipLoader size={20} color="white" />
                            ) : (
                                "Save & Create Channel"
                            )}
                        </button>
                    </div>
                )}
            </SurfaceCard>
        </PageShell>
    );
}

export default CreateChannel;
