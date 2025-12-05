import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaVideo, FaUsers, FaThumbsUp } from "react-icons/fa";
import { MdOutlineSubscriptions } from "react-icons/md";
import PageShell from "../../component/PageShell";
import SurfaceCard from "../../component/SurfaceCard";

function ViewChannel() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    if (!userData?.channel) {
        return (
            <PageShell contentClassName="flex items-center justify-center min-h-screen">
                <SurfaceCard size="sm" heading="No Channel Found" subheading="Create a channel to get started.">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center">
                            <FaUserCircle className="text-5xl text-gray-500" />
                        </div>
                        <button
                            onClick={() => navigate("/createchannel")}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition"
                        >
                            Create Channel
                        </button>
                    </div>
                </SurfaceCard>
            </PageShell>
        );
    }

    const channel = userData.channel;

    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="relative min-h-screen pt-16">
                {/* Channel Banner */}
                <div className="w-full h-48 md:h-64 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 relative overflow-hidden">
                    {channel.bannerUrl ? (
                        <img
                            src={channel.bannerUrl}
                            alt="Channel banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f]" />
                    )}
                </div>

                {/* Channel Info Section */}
                <div className="px-4 md:px-8 lg:px-12 py-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 md:-mt-16">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0f0f0f] bg-[#1c1c1c] overflow-hidden flex items-center justify-center">
                                {channel.avatarUrl ? (
                                    <img
                                        src={channel.avatarUrl}
                                        alt="Channel avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-5xl md:text-6xl text-gray-500" />
                                )}
                            </div>
                        </div>

                        {/* Channel Details */}
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{channel.name}</h1>
                                    <p className="text-sm text-gray-400 mb-4">
                                        @{userData.username} • {channel.category}
                                    </p>
                                    {channel.description && (
                                        <p className="text-sm text-gray-300 max-w-2xl">{channel.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate("/createchannel")}
                                    className="flex items-center gap-2 bg-[#272727] hover:bg-[#3a3a3a] px-4 py-2 rounded-full transition"
                                >
                                    <FaEdit />
                                    <span>Edit Channel</span>
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mt-6 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MdOutlineSubscriptions className="text-lg" />
                                    <span>0 Subscribers</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <FaVideo className="text-lg" />
                                    <span>0 Videos</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <FaThumbsUp className="text-lg" />
                                    <span>0 Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="px-4 md:px-8 lg:px-12 border-b border-gray-800">
                    <div className="flex gap-6">
                        <button className="px-4 py-3 border-b-2 border-white text-white font-medium">
                            Videos
                        </button>
                        <button className="px-4 py-3 text-gray-400 hover:text-white transition">
                            Playlists
                        </button>
                        <button className="px-4 py-3 text-gray-400 hover:text-white transition">
                            About
                        </button>
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="px-4 md:px-8 lg:px-12 py-8">
                    <SurfaceCard size="lg" heading="Your Videos" subheading="Upload your first video to get started." divider={false}>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center mb-4">
                                <FaVideo className="text-3xl text-gray-500" />
                            </div>
                            <p className="text-gray-400 mb-6">No videos yet</p>
                            <button
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition"
                            >
                                Upload Video
                            </button>
                        </div>
                    </SurfaceCard>
                </div>
            </div>
        </PageShell>
    );
}

export default ViewChannel;
