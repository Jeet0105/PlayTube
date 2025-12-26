import { useSelector } from "react-redux";
import VideoCard from "../component/VideoCard";
import { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../component/ShortCard";

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

function RecommendedContent() {
    const { recommendedContent } = useSelector(state => state.user);

    const allVideos = [
        ...(recommendedContent?.recommendedVideos || []),
        ...(recommendedContent?.remainingVideos || [])
    ];
    const allShorts = [
        ...(recommendedContent?.recommendedShorts || []),
        ...(recommendedContent?.remainingShorts || [])
    ];

    const [duration, setDuration] = useState({});

    useEffect(() => {
        if (Array.isArray(allVideos) && allVideos?.length > 0) {
            allVideos.forEach((video) => {
                getVideoDuration(video.videoUrl, (formattedTime) => {
                    setDuration((prev) => ({
                        ...prev,
                        [video._id]: formattedTime,
                    }));
                });
            });
        }
    }, [allVideos]);

    if (!recommendedContent) {
        return null;
    }

    return (
        <div className="px-6 py-4 mb-5">
            {/* Video Section */}
            {allVideos.length > 0 && (
                <section>
                    <div className="flex flex-wrap gap-6 mb-12">
                        {allVideos.map((video) => (
                            <VideoCard
                                id={video._id}
                                thumbnail={video.thumbnail}
                                duration={duration[video._id] || "0:00"}
                                channelLogo={video.channel?.avatar}
                                title={video.title}
                                channelName={video.channel?.name}
                                views={video.views}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Short Section */}
            {allShorts.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <SiYoutubeshorts className="w-6 h-6 text-red-600" /> Shorts
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {allShorts.map((short) => (
                            <div
                                key={short._id}
                                className="shrink-0 w-40 sm:w-[180px]"
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
        </div>
    )
}

export default RecommendedContent