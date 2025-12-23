import { useEffect } from "react";
import { useState } from "react"
import { API_ENDPOINTS } from "../utils/constants";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { SiYoutubeshorts } from "react-icons/si"
import ShortCard from "../component/ShortCard"
import { GoVideo } from "react-icons/go";
import VideoCard from "../component/VideoCard";

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

function LikdedContent() {
    const [likedVideo, setLikedVideo] = useState([]);
    const [likedShort, setLikedShort] = useState([]);

    const [duration, setDuration] = useState({});

    useEffect(() => {
        if (Array.isArray(likedVideo) && likedVideo?.length > 0) {
            likedVideo.forEach((video) => {
                getVideoDuration(video.videoUrl, (formattedTime) => {
                    setDuration((prev) => ({
                        ...prev,
                        [video._id]: formattedTime,
                    }));
                });
            });
        }
    }, [likedVideo]);

    useEffect(() => {
        const fetchLikedContent = async () => {
            try {
                const resVideo = await api.get(API_ENDPOINTS.CONTENT.GET_LIKED_VIDEO);
                setLikedVideo(resVideo.data.likedVideos);

                const resShort = await api.get(API_ENDPOINTS.CONTENT.GET_LIKED_SHORT);
                setLikedShort(resShort.data.likedShorts);
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong.Try again!!");
            }
        }

        fetchLikedContent();
    }, [])


    return (
        <div className="px-4 sm:px-6 py-6 min-h-screen mt-14 lg:mt-6">

            {/* Liked Shorts */}
            {likedShort?.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <SiYoutubeshorts className="w-6 h-6 text-red-600" />
                        Liked Shorts
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {likedShort.map((short) => (
                            <div
                                key={short._id}
                                className="shrink-0 w-[160px] sm:w-[180px]"
                            >
                                <ShortCard
                                    id={short._id}
                                    shortUrl={short.shortUrl}
                                    avatar={short.channel?.avatar}
                                    channelName={short.channel?.name}
                                    title={short.title}
                                    views={short.views}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Liked Videos */}
            {likedVideo?.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <GoVideo className="w-6 h-6 text-red-600" />
                        Liked Videos
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {likedVideo.map((video) => (
                            <div
                                key={video._id}
                                className="shrink-0 w-[240px] sm:w-[260px]"
                            >
                                <VideoCard
                                    id={video._id}
                                    thumbnail={video.thumbnail}
                                    duration={duration[video._id] || "0:00"}
                                    channelLogo={video.channel?.avatar}
                                    title={video.title}
                                    channelName={video.channel?.name}
                                    views={video.views}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {!likedShort?.length && !likedVideo?.length && (
                <div className="flex items-center justify-center h-[60vh] text-gray-500 text-lg">
                    No liked content yet
                </div>
            )}
        </div>
    );
}

export default LikdedContent