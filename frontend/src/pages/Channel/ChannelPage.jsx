import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import VideoCard from "../../component/VideoCard";
import ShortCard from "../../component/ShortCard";
import PlaylistCard from "../../component/PlaylistCard";
import PostCard from "../../component/PostCard";

function ChannelPage() {
    const { channelId } = useParams();
    const { allChannelData, userData } = useSelector((state) => state.user);

    const [activeTab, setActiveTab] = useState("videos");
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [duration, setDuration] = useState({});

    const channel = useMemo(
        () => allChannelData?.find((ch) => ch._id === channelId),
        [allChannelData, channelId]
    );

    const isSubscribed = useMemo(() => {
        if (!channel || !userData) return false;
        return channel.subscribers?.some(
            (sub) =>
                sub?._id?.toString() === userData?._id?.toString() ||
                sub?.toString() === userData?._id?.toString()
        );
    }, [channel, userData]);

    useEffect(() => {
        setSubscribed(isSubscribed);
        setSubscriberCount(channel?.subscribers?.length || 0);
    }, [isSubscribed, channel?.subscribers?.length]);

    const handleSubscribe = async () => {
        if (!channel?._id || !userData?._id || loading) return;

        setLoading(true);

        try {
            await api.post(
                API_ENDPOINTS.USER.SUBSCRIBE,
                { channelId: channel._id },
                { withCredentials: true }
            );

            setSubscribed((prev) => {
                const newStatus = !prev;
                setSubscriberCount((count) => (newStatus ? count + 1 : count - 1));
                return newStatus;
            });

            toast.success(subscribed ? "Unsubscribed successfully" : "Subscribed successfully");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to get video duration
    const getVideoDuration = (url, callback) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;
        video.onloadedmetadata = () => {
            const totalSeconds = Math.floor(video.duration);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        };
        video.onerror = () => {
            callback("0:00");
        };
    };

    // Calculate durations once when channel videos change
    useEffect(() => {
        if (channel?.video?.length) {
            channel.video.forEach((v) => {
                if (!duration[v._id]) { // Avoid recalculating
                    getVideoDuration(v.videoUrl, (formattedTime) => {
                        setDuration((prev) => ({ ...prev, [v._id]: formattedTime }));
                    });
                }
            });
        }
    }, [channel?.video]);

    if (!allChannelData) {
        return (
            <div className="min-h-screen bg-black px-4 sm:px-6 pt-20 animate-pulse">
                <div className="h-48 sm:h-64 bg-neutral-900 rounded-2xl mb-8 sm:mb-10" />
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-neutral-800" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-1/3 bg-neutral-800 rounded" />
                        <div className="h-4 w-1/4 bg-neutral-800 rounded" />
                        <div className="h-4 w-2/3 bg-neutral-800 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-400 text-sm">
                Channel not found.
            </div>
        );
    }

    const joinDate = new Date(channel.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });

    const avatarText = channel.name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Banner */}
            <div className="relative h-48 sm:h-72 w-full">
                {channel.banner ? (
                    <img
                        src={channel.banner}
                        alt="Channel banner"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full bg-neutral-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
            </div>

            {/* Channel Card */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-[-4rem] sm:mt-[-5rem]">
                <div className="flex flex-col md:flex-row gap-6 p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                    {/* Avatar */}
                    <div className="shrink-0 flex justify-center md:justify-start">
                        {channel.avatar || channel.profilePictureUrl ? (
                            <img
                                src={channel.avatar || channel.profilePictureUrl}
                                alt="Channel avatar"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-black shadow-xl"
                            />
                        ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-neutral-800 border-4 border-black flex items-center justify-center text-2xl sm:text-3xl font-semibold">
                                {avatarText}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">{channel.name}</h1>
                            <p className="text-gray-400 text-sm">@{channel.owner?.username?.toLowerCase()}</p>
                        </div>

                        {channel.description && (
                            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto md:mx-0">
                                {channel.description}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm text-gray-400">
                            <span>
                                <strong className="text-white">{subscriberCount}</strong> Subscribers
                            </span>
                            <span>
                                <strong className="text-white">{channel.video?.length || 0}</strong> Videos
                            </span>
                            {channel.category && <span className="capitalize">{channel.category}</span>}
                            <span>Joined {joinDate}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-center md:justify-end items-center mt-4 md:mt-0">
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className={`px-5 sm:px-6 py-2.5 rounded-full font-medium transition shadow-lg flex items-center justify-center min-w-[140px]
                ${subscribed ? "bg-neutral-800 hover:bg-neutral-700" : "bg-orange-600 hover:bg-orange-500"}
                ${loading && "opacity-70 cursor-not-allowed"}
              `}
                        >
                            {loading ? <LoadingSpinner /> : subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sticky top-0 mt-8 sm:mt-10 bg-black/90 backdrop-blur border-b border-white/10 flex flex-wrap sm:flex-nowrap gap-2 sm:gap-8 text-sm z-10 px-2 sm:px-0">
                    {["videos", "shorts", "playlists", "community"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 sm:pb-3 capitalize transition-all cursor-pointer ${activeTab === tab
                                ? "border-b-2 border-orange-500 text-white font-medium"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="mt-12 sm:mt-16 px-2 sm:px-0">
                    {activeTab === "videos" && (
                        <div className="flex flex-wrap gap-5 pb-10 justify-center sm:justify-start">
                            {channel.video?.length ? (
                                channel.video.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        id={v._id}
                                        thumbnail={v?.thumbnail}
                                        duration={duration[v._id] || "0:00"}
                                        channelLogo={channel?.avatar}
                                        title={v?.title}
                                        channelName={channel?.name}
                                        views={v.views}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full mt-10">No videos uploaded yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "shorts" && (
                        <div className="flex flex-wrap gap-4 pb-10 justify-center sm:justify-start">
                            {channel.shorts?.length ? (
                                channel.shorts.map((short) => (
                                    <ShortCard
                                        key={short._id}
                                        id={short._id}
                                        shortUrl={short?.shortUrl}
                                        title={short?.title}
                                        channelName={channel?.name}
                                        avatar={channel?.avatar}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full mt-10">No shorts uploaded yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "playlists" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-10">
                            {channel.playlist?.length ? (
                                channel.playlist.map((p) => (
                                    <PlaylistCard
                                        key={p._id}
                                        id={p._id}
                                        title={p?.title}
                                        videos={p?.video}
                                        saveBy={p?.saveBy}
                                    />
                                    
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full mt-10">No playlists yet.</p>
                            )}
                        </div>
                    )}
                    {activeTab === "community" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-10">
                            {channel.communityPosts?.length ? (
                                channel.communityPosts.map((p) => (
                                    <PostCard
                                        key={p._id}
                                        post={p}
                                    />
                                    
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full mt-10">No playlists yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChannelPage;
