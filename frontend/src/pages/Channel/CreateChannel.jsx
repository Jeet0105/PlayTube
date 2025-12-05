import { useState, useEffect } from "react";
import logo from "../../../public/logo.png";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

function CreateChannel() {
    const { userData } = useSelector((state) => state.user);

    const [step, setStep] = useState(1);

    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleAvatar = (e) => {
        if (e.target.files?.[0]) setAvatar(e.target.files[0]);
    };

    const handleBanner = (e) => {
        if (e.target.files?.[0]) setBanner(e.target.files[0]);
    };

    // Clean preview URLs
    useEffect(() => {
        if (avatar) URL.revokeObjectURL(avatar);
        if (banner) URL.revokeObjectURL(banner);
    }, [avatar, banner]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleCreateChannel = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("name", channelName);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("avatar", avatar);
        formData.append("banner", banner);

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

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-9 h-9 object-cover" />
                    <span className="text-white font-bold text-xl tracking-tight">PlayTube</span>
                </div>

                <img
                    src={userData?.profilePictureUrl}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </header>

            {/* Step Indicator */}
            <div className="flex justify-center mt-6">
                <div className="flex gap-4">
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`w-3 h-3 rounded-full ${step === num ? "bg-orange-500" : "bg-gray-600"
                                }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Main Card */}
            <main className="flex flex-1 justify-center items-start px-4 pt-8">
                <div className="bg-[#1c1c1c] p-8 rounded-2xl w-full max-w-xl shadow-lg border border-gray-800">

                    {/* -------- STEP 1 -------- */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-2">Your Appearance</h2>
                            <p className="text-sm text-gray-400 mb-8">
                                Set your profile picture and channel name.
                            </p>

                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center mb-8">
                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer flex flex-col items-center group"
                                >
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            className="w-24 h-24 rounded-xl object-cover border-2 border-gray-700 group-hover:border-orange-500 transition"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600 group-hover:border-orange-500 transition">
                                            <FaUserCircle size={50} className="text-gray-400" />
                                        </div>
                                    )}
                                    <span className="text-orange-400 text-sm mt-2">
                                        Upload Avatar
                                    </span>
                                </label>

                                <input
                                    type="file"
                                    id="avatar"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatar}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Channel Name"
                                className="w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            />

                            <button
                                disabled={!channelName}
                                onClick={nextStep}
                                className={`w-full py-3 rounded-lg font-medium transition ${channelName
                                        ? "bg-orange-600 hover:bg-orange-700"
                                        : "bg-gray-700 cursor-not-allowed"
                                    }`}
                            >
                                Continue
                            </button>

                            <p
                                onClick={() => navigate("/")}
                                className="text-sm text-blue-400 mt-3 text-center cursor-pointer hover:underline"
                            >
                                Back to Home
                            </p>
                        </div>
                    )}

                    {/* -------- STEP 2 -------- */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Your Channel</h2>

                            <div className="flex flex-col items-center mb-8">
                                {avatar ? (
                                    <img
                                        src={URL.createObjectURL(avatar)}
                                        className="w-24 h-24 rounded-xl object-cover border-2 border-gray-700"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600">
                                        <FaUserCircle size={50} className="text-gray-400" />
                                    </div>
                                )}

                                <h3 className="mt-4 text-lg font-semibold">{channelName}</h3>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 font-medium transition"
                            >
                                Continue & Setup Details
                            </button>

                            <p
                                onClick={prevStep}
                                className="text-sm text-blue-400 mt-3 text-center cursor-pointer hover:underline"
                            >
                                Back
                            </p>
                        </div>
                    )}

                    {/* -------- STEP 3 -------- */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Channel Details</h2>

                            {/* Banner Upload */}
                            <label
                                htmlFor="banner"
                                className="cursor-pointer block bg-[#121212] border border-gray-700 rounded-xl h-36 flex items-center justify-center text-gray-400 hover:border-orange-500 transition mb-6"
                            >
                                {banner ? (
                                    <img
                                        src={URL.createObjectURL(banner)}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    "Click to upload banner image"
                                )}
                            </label>

                            <input
                                type="file"
                                id="banner"
                                className="hidden"
                                accept="image/*"
                                onChange={handleBanner}
                            />

                            <textarea
                                placeholder="Channel Description"
                                className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Channel Category"
                                className="w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />

                            <button
                                disabled={!description || !category || loading}
                                onClick={handleCreateChannel}
                                className={`w-full py-3 rounded-lg font-medium transition ${description && category
                                        ? "bg-orange-600 hover:bg-orange-700"
                                        : "bg-gray-700 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? <ClipLoader size={20} color="white" /> : "Save & Create Channel"}
                            </button>

                            <p
                                onClick={prevStep}
                                className="text-sm text-blue-400 mt-3 text-center cursor-pointer hover:underline"
                            >
                                Back
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default CreateChannel;
