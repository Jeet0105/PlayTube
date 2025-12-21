import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    FaPlay,
    FaPause,
    FaForward,
    FaBackward,
    FaVolumeMute,
    FaVolumeUp,
    FaExpand,
    FaThumbsUp,
    FaThumbsDown,
    FaDownload,
    FaBookmark,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../../component/ShortCard";
import Description from "../../component/Description";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";

function PlayVideo() {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);
    const [channel, setChannel] = useState(null);

    const [showControls, setShowControls] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [isMuted, setIsMuted] = useState(false);
    const [vol, setVol] = useState(1);

    const [loading, setLoading] = useState(false);

    const [comment, setComment] = useState([]);
    const [newcomment, setNewComment] = useState("");

    const { videoId } = useParams();
    const { allVideosData, allShortData } = useSelector((state) => state.content);
    const { userData } = useSelector((state) => state.user);

    const [isSubscribed, setIsSubscribed] = useState(
        Boolean(
            channel?.subscribers?.some(
                (sub) =>
                    sub?._id?.toString() === userData?._id?.toString() ||
                    sub?.toString() === userData?._id?.toString()
            )
        )
    );

    const suggestedVideos = allVideosData?.filter((v) => v._id !== videoId).slice(0, 10) || [];
    const suggestedShorts = allShortData?.slice(0, 10) || [];

    const hasViewed = useRef(false);

    useEffect(() => {
        if (!allVideosData) return;
        const currVideo = allVideosData.find((v) => v._id === videoId);
        if (currVideo) {
            setVideo(currVideo);
            setChannel(currVideo.channel);
            setComment(currVideo?.comments);
        }

        const incView = async () => {
            if (hasViewed.current) return;
            try {
                const res = await api.patch(
                    API_ENDPOINTS.CONTENT.INCREMENT_VIEW(videoId)
                );
                hasViewed.current = true;
                setVideo((prev) => prev ? { ...prev, views: res.data.video.views } : prev)
            } catch (error) {
                console.error("Failed to increment view:", error);
            }
        }
        incView()
    }, [videoId, allVideosData]);

    useEffect(() => {
        if (!showControls) return;
        const timeout = setTimeout(() => setShowControls(false), 2000);
        return () => clearTimeout(timeout);
    }, [showControls]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                toggleIsPlaying();
            }
            if (e.code === "ArrowRight") skipForward();
            if (e.code === "ArrowLeft") skipBackward();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const toggleIsPlaying = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const skipForward = () => {
        if (videoRef.current) videoRef.current.currentTime += 10;
    };

    const skipBackward = () => {
        if (videoRef.current) videoRef.current.currentTime -= 10;
    };

    const handleUpdateTime = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;

        setCurrentTime(current);
        setDuration(total);
        setProgress(total ? (current / total) * 100 : 0);
    };

    const handleSeek = (e) => {
        if (!videoRef.current) return;
        const percent = e.target.value / 100;
        videoRef.current.currentTime = percent * duration;
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    const handleVolume = (e) => {
        const value = parseFloat(e.target.value);
        setVol(value);
        setIsMuted(value === 0);

        if (videoRef.current) {
            videoRef.current.volume = value;
            videoRef.current.muted = value === 0;
        }
    };

    const handleMute = () => {
        if (!videoRef.current) return;

        setIsMuted((prev) => {
            const newState = !prev;
            videoRef.current.muted = newState;
            return newState;
        });
    };

    const handleFullScreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    const handleSubscribe = async () => {
        if (!channel?._id || !userData?._id) {
            return;
        }

        setLoading(true);
        try {
            await api.post(
                API_ENDPOINTS.USER.SUBSCRIBE,
                { channelId: channel._id },
                { withCredentials: true }
            );
        } catch (error) {
            console.error(error);
            toast.error("Try again!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!channel || !userData?._id) return;

        setIsSubscribed(
            channel.subscribers?.some(
                (sub) =>
                    sub?._id?.toString() === userData._id.toString() ||
                    sub?.toString() === userData._id.toString()
            )
        );
    }, [channel?.subscribers, userData?._id]);

    const toggleLike = async () => {
        if (!videoId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.LIKE_VIDEO(videoId));

            setVideo((prev) =>
                prev
                    ? {
                        ...prev,
                        likes: res.data.video.likes,
                        dislikes: res.data.video.dislikes
                    }
                    : prev
            );
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const toggleDislike = async () => {
        if (!videoId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.DISLIKE_VIDEO(videoId));

            setVideo((prev) =>
                prev
                    ? {
                        ...prev,
                        likes: res.data.video.likes,
                        dislikes: res.data.video.dislikes
                    }
                    : prev
            );
        } catch (error) {
            console.error("Failed to toggle dislike:", error);
        }
    };

    const toggleSave = async () => {
        if (!videoId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.SAVE_VIDEO(videoId));

            setVideo((prev) =>
                prev
                    ? {
                        ...prev,
                        saveBy: res.data.video.saveBy,
                    }
                    : prev
            );
        } catch (error) {
            console.error("Failed to toggle save:", error);
        }
    };

    const [commentLoading, setCommentLoading] = useState(false);
    const handleAddComment = async () => {
        if (!newcomment.trim()) return;

        setCommentLoading(true);
        try {
            const res = await api.post(
                API_ENDPOINTS.CONTENT.ADD_COMMENT(videoId),
                { message: newcomment }
            );

            setComment((prev) => [...prev, res.data.comment]);
            setNewComment("");
        } catch (error) {
            console.error(error);
            toast.error("Try again!!");
        } finally {
            setCommentLoading(false);
        }
    };


    const [replyLoading, setReplyLoading] = useState(false)
    const handleReply = async (commentId, replyText) => {
        if (!replyText) return;

        setReplyLoading(true);
        try {
            const res = await api.post(
                API_ENDPOINTS.CONTENT.ADD_REPLY(videoId, commentId),
                { message: replyText }
            );
            // console.log(res.data);


            setComment((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: [...comment.replies, res.data.reply],
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error(error);
            toast.error("Try Again!!");
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6 min-h-screen">

            {/* LEFT — VIDEO PLAYER */}
            <div className="flex-1">
                <div
                    className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
                    onMouseEnter={() => setShowControls(true)}
                    onClick={() => setShowControls(true)}
                >
                    <video
                        src={video?.videoUrl}
                        className="w-full h-full object-contain"
                        ref={videoRef}
                        autoPlay
                        controls={false}
                        onTimeUpdate={handleUpdateTime}
                        onPlay={handlePlay}
                        onPause={handlePause}
                    />

                    {showControls && (
                        <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 z-20 pointer-events-none">
                            <button
                                onClick={skipBackward}
                                className="pointer-events-auto bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                            >
                                <FaBackward size={24} />
                            </button>

                            <button
                                onClick={toggleIsPlaying}
                                className="pointer-events-auto bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                            >
                                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
                            </button>

                            <button
                                onClick={skipForward}
                                className="pointer-events-auto bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                            >
                                <FaForward size={24} />
                            </button>
                        </div>
                    )}

                    {showControls && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-3 py-3 z-30">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={progress}
                                onChange={handleSeek}
                                className="w-full accent-orange-600 cursor-pointer"
                            />

                            <div className="flex items-center justify-between mt-2 text-xs sm:text-sm text-gray-200">
                                <div className="flex items-center gap-3">
                                    <span>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>

                                    <button
                                        className="bg-black/60 px-2 py-1 rounded hover:bg-orange-600 transition"
                                        onClick={skipBackward}
                                    >
                                        <FaBackward size={14} />
                                    </button>

                                    <button
                                        className="bg-black/60 px-2 py-1 rounded hover:bg-orange-600 transition"
                                        onClick={toggleIsPlaying}
                                    >
                                        {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                                    </button>

                                    <button
                                        className="bg-black/60 px-2 py-1 rounded hover:bg-orange-600 transition"
                                        onClick={skipForward}
                                    >
                                        <FaForward size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button onClick={handleMute}>
                                        {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                                    </button>

                                    <input
                                        type="range"
                                        value={isMuted ? 0 : vol}
                                        onChange={handleVolume}
                                        className="accent-orange-600 w-16 sm:w-24"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                    />

                                    <button onClick={handleFullScreen}><FaExpand size={14} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex gap-3">
                    {video?.title}
                </h1>
                <p className="text-sm text-gray-400">{video?.views} views</p>
                <div className="flex flex-wrap items-center justify-between mt-2">
                    <Link to={`/channelpage/${channel?._id}`} className="flex items-center justify-start gap-4">
                        <img src={channel?.avatar} className="w-12 h-12 rounded-full border-2 border-gray-600" alt="Channel Avatar" />
                        <div>
                            <h1 className="text-md font-bold">{channel?.name}</h1>
                            <h3 className="text-[13px]">{channel?.subscribers.length}</h3>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className={`px-5 py-2 rounded-full ml-5 text-md transition cursor-pointer
                            ${isSubscribed
                                    ? "bg-gray-700 text-white"
                                    : "bg-white text-black hover:bg-orange-600"
                                }`}
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </Link>

                    <div className="flex items-center gap-6 mt-3">
                        <IconButton
                            icon={FaThumbsUp}
                            label="Likes"
                            active={video?.likes?.includes(userData?._id)}
                            count={video?.likes?.length}
                            onClick={toggleLike}
                        />

                        <IconButton
                            icon={FaThumbsDown}
                            label="Dislikes"
                            active={video?.dislikes?.includes(userData?._id)}
                            count={video?.dislikes?.length}
                            onClick={toggleDislike}
                        />

                        <IconButton
                            icon={FaDownload}
                            label="Download"
                            onClick={() => {
                                if (!video?.videoUrl) return;

                                const link = document.createElement("a");
                                link.href = video.videoUrl;
                                link.download = `${video.title?.replace(/[^a-z0-9]/gi, "_") || "video"}.mp4`;

                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        />

                        <IconButton
                            icon={FaBookmark}
                            label="Save"
                            active={video?.saveBy?.includes(userData?._id)}
                            onClick={toggleSave}
                        />
                    </div>
                </div>

                <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
                    <h2 className="text-md font-semibold mb-2">Description</h2>
                    <Description text={video?.description} />
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Comments</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            value={newcomment}
                            onChange={(e) => setNewComment(e.target.value)}
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
                        />
                        <button disabled={commentLoading} onClick={handleAddComment} className="bg-orange-600 text-white px-4 py-2 rounded-lg">{commentLoading ? <LoadingSpinner size={20} color="black" /> : "Post"}</button>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {comment?.map((cmt) => (
                            <div key={cmt._id} className="p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm">
                                <div className="flex items-center justify-start gap-1">
                                    <img src={cmt?.author?.profilePictureUrl} className="w-8 h-8 rounded-full object-cover" />
                                    <h2 className="text-[13px]">@{cmt?.author?.username?.toLowerCase()}</h2>
                                </div>
                                <p className="font-medium p-5">{cmt?.message}</p>
                                <div className="ml-4 mt-2 space-y-2">
                                    {cmt.replies?.map((reply) => (
                                        <div key={reply._id} className="p-2 bg-[#2a2a2a] rounded">
                                            <div className="flex items-center justify-start gap-1">
                                                <img src={reply.author.profilePictureUrl} className="w-6 h-6 rounded-full object-cover" />
                                                <h2 className="text-[13px]">@{reply?.author?.username?.toLowerCase()}</h2>
                                                <p className="px-5 py-5">{reply?.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ReplySection comment={cmt} handleReply={handleReply} loading={replyLoading} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT — SHORTS SIDEBAR */}
            <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-scroll">
                <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
                    <SiYoutubeshorts className="text-orange-600" /> Shorts
                </h2>

                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
                    {suggestedShorts?.map((short) => (
                        <div key={short._id} className="bg-white/5 p-2 rounded-lg">
                            <ShortCard
                                shortUrl={short?.shortUrl}
                                title={short?.title}
                                channelName={short?.channel?.name}
                                avatar={short?.channel?.avatar}
                                id={short?._id}
                            />
                        </div>
                    ))}
                </div>

                {/* UP NEXT */}
                <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
                <div className="space-y-3">
                    {suggestedVideos?.map((v) => (
                        <div
                            key={v._id}
                            className="flex gap-2 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
                            onClick={() => navigate(`/playvideo/${v._id}`)}
                        >
                            <img
                                src={v.thumbnail}
                                alt={v.title}
                                className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
                            />
                            <div>
                                <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">
                                    {v.title}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400">{v?.channel?.name}</p>
                                <p className="text-xs sm:text-sm text-gray-400">{v?.views} views</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}

const ReplySection = ({ comment, handleReply, loading }) => {
    const [replyText, setReplyText] = useState("");
    const [showReplyInput, setShowReplyInput] = useState(false);
    return (
        <div className="mt-3">
            {showReplyInput &&
                <div className="flex gap-2 mt-1 ml-4">
                    <input
                        type="text"
                        className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring focus:ring-orange-600 text-sm"
                        placeholder="Add a reply..."
                        onChange={(e) => setReplyText(e.target.value)}
                        value={replyText}
                    />
                    <button
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm"
                        onClick={() => { handleReply(comment._id, replyText); setShowReplyInput(false); setReplyText("") }}
                    >{loading ? <LoadingSpinner size={20} /> : "Reply"}</button>
                </div>
            }
            <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="ml-4 text-xs text-gray-400 mt-1"
            >
                Reply
            </button>
        </div>
    )
}

const IconButton = ({ icon: Icon, active, label, count, onClick }) => {
    return (
        <button
            type="button"
            className="flex flex-col items-center gap-1"
            onClick={onClick}
        >
            <div
                className={`p-3 rounded-full transition 
          ${active
                        ? "bg-white"
                        : "bg-[#00000065] border border-gray-700 hover:bg-gray-700"
                    }`}
            >
                <Icon size={20} className={active ? "text-black" : "text-white"} />
            </div>

            <span className="flex gap-1 text-xs mt-1 text-white">
                {count !== undefined && ` ${count}`}
                <span>{label}</span>
            </span>
        </button>
    );
};

export default PlayVideo;
