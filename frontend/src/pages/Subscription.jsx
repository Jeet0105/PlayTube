import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import ShortCard from "../component/ShortCard";
import VideoCard from "../component/VideoCard";
import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../component/PlaylistCard";
import PostCard from "../component/PostCard";
import { RiUserCommunityFill } from "react-icons/ri";

const getVideoDuration = (url) => {
    if (typeof document === "undefined") return Promise.resolve("0:00");

    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;

        const onLoaded = () => {
            const totalSeconds = Math.floor(video.duration);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
            cleanup();
        };

        const onError = () => {
            resolve("0:00");
            cleanup();
        };

        const cleanup = () => {
            video.removeEventListener("loadedmetadata", onLoaded);
            video.removeEventListener("error", onError);
            video.src = "";
        };

        video.addEventListener("loadedmetadata", onLoaded);
        video.addEventListener("error", onError);
    });
};

function Subscription() {
    const {
        subscribedChannels = [],
        subscribedVideos = [],
        subscribedShorts = [],
        subscribedPosts = [],
        subscribedPlaylists = [],
    } = useSelector((state) => state.user);

    const [duration, setDuration] = useState({});

    useEffect(() => {
        if (!Array.isArray(subscribedVideos) || subscribedVideos.length === 0)
            return;

        let mounted = true;

        (async () => {
            const entries = await Promise.all(
                subscribedVideos.map(async (v) => [
                    v._id,
                    await getVideoDuration(v.videoUrl),
                ])
            );

            if (mounted) {
                setDuration(Object.fromEntries(entries));
            }
        })();

        return () => {
            mounted = false;
        };
    }, [subscribedVideos]);

    return (
        <div className="px-6 py-4 min-h-screen">
            {/* subscribed channels */}
            <div className="flex gap-6 overflow-x-auto pb-6 pt-7">
                {subscribedChannels?.map((ch) => (
                    <Link
                        key={ch._id}
                        className="flex flex-col items-center shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200"
                        to={`/channelpage/${ch._id}`}
                    >
                        <img
                            src={ch?.avatar}
                            alt={ch?.name || "Channel avatar"}
                            className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover shadow-md"
                        />
                        <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
                            {ch?.name}
                        </span>
                    </Link>
                ))}
            </div>

            {!subscribedChannels?.length && (
                <div className="flex justify-center items-center h-[30vh] text-gray-400 text-xl">
                    No channel subscribed yet 😔
                </div>
            )}

            {/* shorts section */}
            {subscribedShorts?.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
                        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
                        Subscribed Shorts
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {subscribedShorts.map((short) => (
                            <div key={short._id} className="shrink-0 w-40 sm:w-[180px]">
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
                </>
            )}

            {/* video section */}
            {subscribedVideos?.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <GoVideo className="w-6 h-6 text-orange-600" />
                        Subscribed Videos
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                        {subscribedVideos.map((video) => (
                            <div key={video._id} className="shrink-0 w-60 sm:w-[260px]">
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

            {/* playlist section */}
            {subscribedPlaylists?.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <FaList className="w-6 h-6 text-orange-600" />
                        Subscribed Playlists
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {subscribedPlaylists?.map((pl) => (
                            <PlaylistCard
                                key={pl._id}
                                id={pl._id}
                                title={pl.title}
                                videos={pl.video}
                                saveBy={pl.saveBy}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* post section */}
            {subscribedPosts?.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                        <RiUserCommunityFill className="w-6 h-6 text-orange-600" />
                        Subscribed Posts
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {subscribedPosts?.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Subscription;
