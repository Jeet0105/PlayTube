import { useEffect, useState } from "react";
import ChannelCard from "./ChannelCard";
import VideoCard from "./VideoCard";
import ShortCard from "./ShortCard"
import PlaylistCard from "./PlaylistCard";

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

function SearchResults({ searchResults }) {
    const isEmpty =
        (!searchResults?.channels || searchResults.channels.length === 0) &&
        (!searchResults?.videos || searchResults.videos.length === 0) &&
        (!searchResults?.shorts || searchResults.shorts.length === 0) &&
        (!searchResults?.playlists || searchResults.playlists.length === 0);

    const [duration, setDuration] = useState({});

    useEffect(() => {
        if (Array.isArray(searchResults?.videos) && searchResults?.videos.length > 0) {
            searchResults?.videos.forEach((video) => {
                getVideoDuration(video.videoUrl, (formattedTime) => {
                    setDuration((prev) => ({
                        ...prev,
                        [video._id]: formattedTime,
                    }));
                });
            });
        }
    }, [searchResults?.videos]);
    return (
        <div className="px-6 py-4 bg-[#00000051] border border-gray-800 mb-5">
            <h2 className="text-2xl font-bold mb-4">Search Results :</h2>
            {isEmpty ? (
                <p className="text-gray-400 text-lg"></p>
            ) : (
                <>
                    {/* Channels */}
                    {searchResults.channels?.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4">Channels</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {searchResults.channels.map((ch) => (
                                    <ChannelCard
                                        key={ch._id}
                                        id={ch._id}
                                        name={ch.name}
                                        avatar={ch?.avatar}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos */}
                    {searchResults.videos?.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4">Videos</h3>
                            <div className="flex flex-wrap gap-6 mb-12">
                                {searchResults.videos.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        channelLogo={v.channel?.avatar}
                                        channelName={v.channel?.name}
                                        duration={duration[v._id] || "0.00"}
                                        id={v._id}
                                        thumbnail={v?.thumbnail}
                                        title={v?.title}
                                        views={v?.views}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shorts */}
                    {searchResults.shorts?.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4">Shorts</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {searchResults.shorts.map((short) => (
                                    <ShortCard
                                        key={short._id}
                                        avatar={short.channel?.avatar}
                                        channelName={short.channel?.name}
                                        id={short._id}
                                        shortUrl={short?.shortUrl}
                                        title={short?.title}
                                        views={short?.views}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Playlists */}
                    {searchResults.playlists?.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4">Playlists</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {searchResults.playlists.map((p) => (
                                    <PlaylistCard
                                        key={p._id}
                                        id={p._id}
                                        saveBy={p?.saveBy}
                                        title={p?.title}
                                        videos={p?.video}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SearchResults