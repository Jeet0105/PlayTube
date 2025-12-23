import { useState } from "react";
import { FaBookmark, FaListUl, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import VideoCard from "./VideoCard";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";

function PlaylistCard({ id, title, videos = [], saveBy }) {
    const [showVideos, setShowVideos] = useState(false);
    const { userData } = useSelector((state) => state.user);

    const [isSaved, setIsSaved] = useState(
        saveBy?.some(
            (uid) => uid.toString() === userData?._id?.toString()
        ) || false
    );

    const thumbnail =
        videos?.[0]?.thumbnail ||
        "https://via.placeholder.com/300x200?text=No+Thumbnail";

    const handleSave = async () => {
        if (!userData?._id) {
            toast.error("Please login to save playlists");
            return;
        }

        try {
            const res = await api.post(
                API_ENDPOINTS.CONTENT.SAVE_PLAYLIST,
                { playlistId: id }
            );

            toast.success(res.data.message);

            const updatedIsSaved =
                res.data.playlist.saveBy?.some(
                    (uid) => uid.toString() === userData._id.toString()
                );

            setIsSaved(updatedIsSaved);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Try again!");
        }
    };

    return (
        <>
            {/* Playlist Card */}
            <div className="relative w-60 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3">
                    <h3 className="font-semibold text-white truncate">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-300">
                        {videos.length}{" "}
                        {videos.length === 1 ? "Video" : "Videos"}
                    </p>
                </div>

                {/* Save Playlist */}
                <button
                    onClick={handleSave}
                    className={`${
                        isSaved
                            ? "bg-white text-black hover:bg-gray-300"
                            : "bg-black/70 text-white hover:bg-black"
                    } absolute top-2 right-2 p-2 rounded-full border border-gray-700 transition`}
                    title="Save playlist"
                >
                    <FaBookmark size={16} />
                </button>

                {/* Open Playlist */}
                <button
                    onClick={() => setShowVideos(true)}
                    className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition"
                    title="View playlist"
                >
                    <FaListUl size={18} />
                </button>
            </div>

            {/* Playlist Modal */}
            {showVideos && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
                    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 border border-gray-700">
                        {/* Close */}
                        <button
                            onClick={() => setShowVideos(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        >
                            <FaTimes size={24} />
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            {title}
                            <span className="text-gray-400 font-normal text-base">
                                · Videos
                            </span>
                        </h2>

                        <div className="h-1 w-20 bg-orange-600 rounded-full mb-6" />

                        {/* Videos */}
                        {videos.length ? (
                            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                                {videos.map((v) => (
                                    <VideoCard
                                        key={v._id}
                                        id={v._id}
                                        thumbnail={v.thumbnail}
                                        duration={v.duration || "0:00"}
                                        channelLogo={v.channel?.avatar}
                                        title={v.title}
                                        channelName={v.channel?.name}
                                        views={v.views}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-10">
                                No videos in this playlist.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default PlaylistCard;
