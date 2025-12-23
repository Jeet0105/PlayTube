import { useEffect, useMemo, useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";

function PostCard({ post }) {
  const { userData } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [comments, setComments] = useState(post?.comments || []);

  const formattedDate = useMemo(() => {
    if (!post?.createdAt) return "";
    return new Date(post.createdAt).toDateString();
  }, [post?.createdAt]);

  // Sync like state
  useEffect(() => {
    if (!userData?._id || !Array.isArray(post?.likes)) return;

    const likedByUser = post.likes.some((like) => {
      if (!like) return false;
      if (typeof like === "object" && like._id) return like._id.toString() === userData._id;
      return like.toString() === userData._id;
    });

    setLiked(likedByUser);
    setLikeCount(post.likes.length);
  }, [post?.likes, userData?._id]);

  // Handle like
  const handleLike = async () => {
    if (!userData?._id) return toast.info("Please login to like posts");
    if (loading) return;

    setLoading(true);
    const newLiked = !liked;
    const prevLikeCount = likeCount;

    setLiked(newLiked);
    setLikeCount(newLiked ? prevLikeCount + 1 : prevLikeCount - 1);

    try {
      const { data } = await api.post(API_ENDPOINTS.CONTENT.POST_LIKE, { postId: post._id });
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      toast.error("Failed to update like");
      setLiked(!newLiked);
      setLikeCount(prevLikeCount);
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(API_ENDPOINTS.CONTENT.POST_COMMENT, {
        postId: post._id,
        message: commentText,
      });
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  // Add reply
  const handleAddReply = async (commentId, text) => {
    if (!text.trim()) return;

    try {
      const { data } = await api.post(API_ENDPOINTS.CONTENT.POST_REPLY, {
        postId: post._id,
        commentId,
        message: text,
      });

      setComments((prev) =>
        prev.map((cmt) =>
          cmt._id === commentId ? { ...cmt, replies: [...cmt.replies, data.reply] } : cmt
        )
      );

      setReplyingTo(null);
      setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
    } catch {
      toast.error("Failed to add reply");
    }
  };

  // Helper: get username/avatar safely
  const getUser = (author) => ({
    username: author?.username?.toLowerCase() || "unknown",
    avatar: author?.profilePictureUrl || "/default-avatar.png",
  });

  return (
    <div className="w-full bg-gray-900 rounded-xl p-5 border border-gray-700 shadow-lg mb-8">
      {/* Post content */}
      <p className="text-gray-200 text-base leading-relaxed">{post?.content}</p>
      {post?.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full h-80 object-cover rounded-xl mt-4"
        />
      )}

      {/* Action bar */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <span className="italic">{formattedDate}</span>
        <div className="flex gap-6 items-center">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1 transition ${liked ? "text-red-500" : "hover:text-red-400"} ${loading && "opacity-60"}`}
          >
            <FaHeart />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1 hover:text-orange-400 transition"
          >
            <FaComment />
            <span>{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-6 space-y-4">
          {/* Add comment */}
          <div className="flex flex-col gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 w-fit bg-orange-500 hover:bg-orange-600 rounded text-sm font-medium"
            >
              Post
            </button>
          </div>

          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((cmt) => {
                const cmtUser = getUser(cmt.author);
                return (
                  <div key={cmt._id} className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={cmtUser.avatar}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">@{cmtUser.username}</span>
                          <button
                            className="text-xs font-medium text-orange-400 hover:text-orange-500 transition"
                            onClick={() =>
                              setReplyingTo((prev) => (prev === cmt._id ? null : cmt._id))
                            }
                          >
                            Reply
                          </button>
                        </div>
                        <p className="text-sm text-gray-200 mt-1">{cmt.message}</p>

                        {/* Reply input */}
                        {replyingTo === cmt._id && (
                          <div className="mt-2 flex flex-col gap-2">
                            <input
                              value={replyTexts[cmt._id] || ""}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({ ...prev, [cmt._id]: e.target.value }))
                              }
                              placeholder="Write a reply..."
                              className="flex-1 bg-gray-900 border border-gray-700 text-sm text-white px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                              onClick={() => handleAddReply(cmt._id, replyTexts[cmt._id] || "")}
                              className="bg-orange-500 hover:bg-orange-600 text-sm text-white px-4 rounded transition w-fit"
                            >
                              Post
                            </button>
                          </div>
                        )}

                        {/* Replies */}
                        {cmt.replies?.length > 0 && (
                          <div className="mt-3 pl-10 space-y-2 border-l border-gray-700">
                            {cmt.replies.map((reply) => {
                              const replyUser = getUser(reply.author);
                              return (
                                <div key={reply._id} className="flex items-start gap-3">
                                  <img
                                    src={replyUser.avatar}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full object-cover mt-1"
                                  />
                                  <div>
                                    <span className="text-xs font-semibold text-gray-300">@{replyUser.username}</span>
                                    <p className="text-sm text-gray-200 mt-0.5">{reply.message}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
