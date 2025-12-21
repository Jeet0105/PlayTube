import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
    FaThumbsUp,
    FaThumbsDown,
    FaComment,
    FaBookmark,
    FaDownload,
    FaPlay,
    FaArrowDown,
} from "react-icons/fa";
import Description from "../../component/Description";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

// Shuffle helper
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function Shorts() {
    const { allShortData } = useSelector((state) => state.content);
    const { userData } = useSelector((state) => state.user);
    const [shortList, setShortList] = useState([]);
    const [mutedState, setMutedState] = useState({});
    const [playingState, setPlayingState] = useState({});
    const [loading, setLoading] = useState(false);
    const [openCommentId, setOpenCommentId] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState("");
    const [showReply, setShowReply] = useState({});
    const [replyText, setReplyText] = useState({});

    const videoRefs = useRef({});
    const currentVideoRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!allShortData?.length) return;
        setShortList((prev) => (prev.length ? prev : shuffleArray(allShortData)));
    }, [allShortData]);

    const setVideoRef = useCallback((id, el) => {
        if (el) videoRefs.current[id] = el;
    }, []);

    useEffect(() => {
        if (!shortList.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    const id = video.dataset.id;

                    if (entry.isIntersecting) {
                        if (currentVideoRef.current && currentVideoRef.current !== video) {
                            currentVideoRef.current.pause();
                        }
                        video.muted = mutedState[id] ?? true;
                        video.play().catch(() => { });
                        currentVideoRef.current = video;
                        setPlayingState((p) => ({ ...p, [id]: true }));
                    } else {
                        video.pause();
                        setPlayingState((p) => ({ ...p, [id]: false }));
                    }
                });
            },
            { threshold: 0.6 }
        );

        Object.values(videoRefs.current).forEach((v) => v && observer.observe(v));
        return () => observer.disconnect();
    }, [shortList, mutedState]);

    const togglePlay = (id) => {
        const video = videoRefs.current[id];
        if (!video) return;
        video.paused ? video.play() : video.pause();
        setPlayingState((p) => ({ ...p, [id]: !video.paused }));
    };

    const toggleMute = (id) => {
        const video = videoRefs.current[id];
        if (!video) return;
        video.muted = !video.muted;
        setMutedState((p) => ({ ...p, [id]: video.muted }));
    };

    const handleSubscribe = async (channelId) => {
        if (!channelId || !userData?._id) {
            return;
        }
        setLoading(true);
        try {
            const res = await api.post(
                API_ENDPOINTS.USER.SUBSCRIBE,
                { channelId },
                { withCredentials: true }
            );

            const updatedChannel = res.data?.channel;
            setShortList((prev) =>
                prev.map((short) =>
                    short?.channel?._id === channelId ? { ...short, channel: updatedChannel } : short
                )
            );
        } catch (error) {
            console.log(error);
            toast.error("Try again!!");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (shortId) => {
        if (!shortId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.LIKE_SHORT(shortId));
            const updatedPartial = res.data.short;

            setShortList((prev) =>
                prev.map((short) =>
                    short?._id === shortId ? { ...short, ...updatedPartial } : short
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Try Again!!!");
        }
    };

    const toggleDislike = async (shortId) => {
        if (!shortId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.DISLIKE_SHORT(shortId));
            const updatedPartial = res.data.short;

            setShortList((prev) =>
                prev.map((short) =>
                    short?._id === shortId ? { ...short, ...updatedPartial } : short
                )
            );
        } catch (error) {
            console.error("Error toggling dislike:", error);
            toast.error("Try Again!!!");
        }
    };

    const toggleSave = async (shortId) => {
        if (!shortId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.SAVE_SHORT(shortId));
            const updatedPartial = res.data.short;

            setShortList((prev) =>
                prev.map((short) =>
                    short?._id === shortId ? { ...short, ...updatedPartial } : short
                )
            );

            toast.success(
                updatedPartial.saveBy.includes(userData?._id)
                    ? "Short saved"
                    : "Removed from saved"
            );
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error("Try Again!!!");
        }
    };

    const fetchComments = async (shortId) => {
        try {
            const res = await api.get(
                API_ENDPOINTS.CONTENT.GET_SHORT_COMMENTS(shortId)
            );

            setComments((prev) => ({
                ...prev,
                [shortId]: res.data.comments,
            }));
        } catch {
            toast.error("Failed to load comments");
        }
    };

    const incrementView = async (shortId) => {
        if (!shortId) return;

        try {
            const res = await api.patch(API_ENDPOINTS.CONTENT.INCREMENT_VIEW_SHORT(shortId));
            const { views } = res.data;

            setShortList((prev) =>
                prev.map((short) =>
                    short?._id === shortId ? { ...short, views } : short
                )
            );
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    };

    const handleAddComment = async (shortId) => {
        if (!shortId) {
            return;
        }
        if (!newComment.trim()) {
            return;
        }
        try {
            const res = await api.post(
                API_ENDPOINTS.CONTENT.ADD_COMMENT_SHORT(shortId),
                { message: newComment }
            );

            setComments((prev) => ({
                ...prev,
                [shortId]: [...(prev[shortId] || []), res.data.comment]
            }));

            setNewComment("");
        } catch (error) {
            console.error(error);
            toast.error("Try again!!");
        }
    }

    const handleAddReply = async (shortId, commentId, replyText) => {
        if (!shortId || !commentId) {
            return;
        }
        if (!replyText.trim()) {
            return;
        }
        try {
            const res = await api.post(
                API_ENDPOINTS.CONTENT.ADD_REPLY_SHORT(shortId, commentId),
                { message: replyText }
            );

            setComments(prev => ({
                ...prev,
                [shortId]: (prev[shortId] || []).map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: [...(comment.replies || []), res.data.reply]
                        }
                        : comment
                )
            }));
        } catch (error) {
            console.error(error);
            toast.error("Try again!!");
        }
    };

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            {shortList.map((short) => {
                const isMuted = mutedState[short._id] ?? true;
                const isPlaying = playingState[short._id] ?? false;

                return (
                    <div
                        key={short._id}
                        className="h-screen w-full snap-start flex justify-center items-center"
                    >
                        <div
                            onClick={() => {
                                togglePlay(short._id);
                                // incrementView(short._id);
                            }}
                            className="relative w-full max-w-[400px] h-[80vh] aspect-[9/16]"
                        >
                            <video
                                data-id={short._id}
                                src={short.shortUrl}
                                muted={isMuted}
                                loop
                                playsInline
                                preload="metadata"
                                ref={(el) => setVideoRef(short._id, el)}
                                className="w-full h-full object-cover rounded-2xl"
                            />

                            {/* Gradients */}
                            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />

                            {/* Play Overlay */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/60 p-6 rounded-full">
                                        <FaPlay className="text-white text-4xl ml-1" />
                                    </div>
                                </div>
                            )}

                            {/* Caption Block */}
                            <div className="absolute bottom-0 left-4 text-white max-w-[72%] space-y-1">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={short?.channel?.avatar}
                                        alt={short?.channel?.name}
                                        className="w-8 h-8 rounded-full border border-gray-600"
                                        onClick={()=>navigate(`/channelpage/${short?.channel?._id}`)}
                                    />
                                    <span onClick={()=>navigate(`/channelpage/${short?.channel?._id}`)} className="font-semibold text-gray-200">
                                        @{short?.channel?.name}
                                    </span>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleSubscribe(short?.channel?._id)}
                                        className={`${short?.channel?.subscribers?.includes(userData?._id) ? "bg-[#000000a1] text-white border border-gray-700" : "bg-white text-black"} text-xs px-5 py-2.5 rounded-full cursor-pointer`}
                                    >
                                        {loading ? <LoadingSpinner size={20} color="gray" /> : short?.channel?.subscribers?.includes(userData?._id) ? "Subscribed" : "Subscribe"}
                                    </button>
                                </div>

                                <p className="text-sm line-clamp-2">{short.title}</p>

                                <div className="flex flex-wrap gap-1">
                                    {short?.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <Description text={short.description} />
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute right-3 bottom-20 flex flex-col items-center gap-1 text-white">
                                <IconButton
                                    icon={FaThumbsUp}
                                    label="Likes"
                                    active={short?.likes?.includes(userData?._id)}
                                    count={short?.likes?.length}
                                    onClick={() => toggleLike(short._id)}
                                />

                                <IconButton
                                    icon={FaThumbsDown}
                                    label="Dislikes"
                                    active={short?.dislikes?.includes(userData?._id)}
                                    count={short?.dislikes?.length}
                                    onClick={() => toggleDislike(short._id)}
                                />

                                <IconButton
                                    icon={FaComment}
                                    label="Comment"
                                    onClick={() => {
                                        setOpenCommentId(short._id);
                                        fetchComments(short._id);
                                    }}
                                />

                                <IconButton
                                    icon={FaDownload}
                                    label="Download"
                                />

                                <IconButton
                                    icon={FaBookmark}
                                    label="Save"
                                    active={short?.saveBy?.includes(userData?._id)}
                                    onClick={() => toggleSave(short._id)}
                                />
                            </div>

                            {/* Mute Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMute(short._id);
                                }}
                                className="absolute bottom-1 right-3 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:scale-110 transition"
                            >
                                {isMuted ? "🔇" : "🔊"}
                            </button>

                            {openCommentId === short._id && (
                                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3>Comment</h3>
                                        <button className="cursor-pointer" onClick={() => setOpenCommentId(null)}
                                        ><FaArrowDown size={20} /></button>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <input value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..." type="text" className="flex-1 bg-gray-900 text-white p-2 rounded" />
                                        <button onClick={() => handleAddComment(short._id)} className="bg-black px-4 py-2 border border-gray-700 rounded-xl">Post</button>

                                    </div>
                                    <div className="space-y-4 mt-4">
                                        {comments[short._id]?.length > 0 ? (
                                            comments[short._id].map((cmt, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gray-800/40 border border-gray-700 rounded-xl p-3"
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={cmt?.author?.profilePictureUrl}
                                                            alt="profile"
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />

                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-white">
                                                                @{cmt?.author?.username?.toLowerCase()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Comment */}
                                                    <p className="text-sm text-gray-200 mt-2 ml-11 leading-relaxed">
                                                        {cmt?.message}
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-4 ml-11 mt-2">
                                                        <button
                                                            className="text-xs font-medium text-orange-400 hover:text-orange-500 transition"
                                                            onClick={() =>
                                                                setShowReply(prev => ({
                                                                    ...prev,
                                                                    [cmt._id]: !prev?.[cmt._id],
                                                                }))
                                                            }
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>

                                                    {/* Reply Input */}
                                                    {showReply?.[cmt._id] && (
                                                        <div className="ml-11 mt-3 flex gap-2">
                                                            <input
                                                                value={replyText[cmt._id] || ""}
                                                                onChange={(e) =>
                                                                    setReplyText(prev => ({
                                                                        ...prev,
                                                                        [cmt._id]: e.target.value
                                                                    }))
                                                                }
                                                                type="text"
                                                                placeholder="Write a reply..."
                                                                className="flex-1 bg-gray-900 border border-gray-700 text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                            />

                                                            <button
                                                                onClick={() => {
                                                                    handleAddReply(short._id, cmt._id, replyText[cmt._id]);
                                                                    setReplyText(prev => ({ ...prev, [cmt._id]: "" }));
                                                                    setShowReply(prev => ({ ...prev, [cmt._id]: false }));
                                                                }}
                                                                className="bg-orange-500 hover:bg-orange-600 text-sm text-white px-4 rounded-lg transition"
                                                            >
                                                                Post
                                                            </button>
                                                        </div>
                                                    )}

                                                    {cmt?.replies?.length > 0 && (
                                                        <div className="ml-11 mt-4 space-y-3 border-l border-gray-700 pl-4">
                                                            {cmt.replies.map((reply) => (
                                                                <div
                                                                    key={reply._id}
                                                                    className="flex gap-3 bg-gray-900/80 hover:bg-gray-900 transition rounded-xl p-3"
                                                                >
                                                                    {/* Avatar */}
                                                                    <img
                                                                        src={reply?.author?.profilePictureUrl}
                                                                        alt="profile"
                                                                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-700"
                                                                    />

                                                                    {/* Content */}
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-xs font-semibold text-gray-300">
                                                                            @{reply?.author?.username?.toLowerCase()}
                                                                        </span>

                                                                        <p className="text-sm text-gray-200 leading-relaxed">
                                                                            {reply?.message}
                                                                        </p>

                                                                        {/* Todo */}
                                                                        {/* <div className="flex items-center gap-3 mt-1">
                                                                            <button className="text-[11px] text-gray-400 hover:text-orange-400 transition">
                                                                                Reply
                                                                            </button>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 text-center py-4">
                                                No comments yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Shorts;

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
