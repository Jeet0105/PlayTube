import { useState, useRef } from "react";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllVideosData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

function CreateVideo() {
    const [videoUrl, setVideoUrl] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);

    const dispath = useDispatch();
    const { allVideosData } = useSelector(state => state.content);
    const { channelData } = useSelector(state => state.user);
    const navigate = useNavigate();

    // file input refs (fixes re-upload issue)
    const videoRef = useRef(null);
    const thumbRef = useRef(null);

    const handleVideo = (e) => {
        setVideoUrl(e.target.files[0]);
    };

    const handleThumbnail = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleUploadVideo = async () => {
        if (!videoUrl || !thumbnail || !title.trim()) {
            toast.error("All fields are required.");
            return;
        }

        const parsedTags = tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("tags", JSON.stringify(parsedTags));

            formData.append("channelId", channelData._id);

            formData.append("video", videoUrl);
            formData.append("thumbnail", thumbnail);

            const res = await api.post(
                API_ENDPOINTS.CONTENT.Create_Video,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setVideoUrl(null);
            setThumbnail(null);
            setTitle("");
            setDescription("");
            setTags("");

            if (videoRef.current) videoRef.current.value = "";
            if (thumbRef.current) thumbRef.current.value = "";
            console.log(res.data);
            if (res.status == 201) {
                toast.success("Video uploaded successfully");
                navigate("/");
                dispath(setAllVideosData([...allVideosData, res.data]));
                const updatedChannel = {
                    ...channelData,videos: [...(channelData.videos || []),res.data]
                }
                dispath(setChannelData(updatedChannel));
            } else {
                toast.error("Try Again!!")
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Upload failed.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5">
            <div className="flex flex-1 justify-center items-center px-4 py-6">
                <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">

                    {/* Upload Video */}
                    <label
                        htmlFor="video"
                        className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 hover:border-orange-500 transition"
                    >
                        {videoUrl ? (
                            <p className="text-orange-400">{videoUrl.name}</p>
                        ) : (
                            <p className="text-gray-400">Click to upload video</p>
                        )}

                        <input
                            type="file"
                            id="video"
                            ref={videoRef}
                            onChange={handleVideo}
                            className="hidden"
                            accept="video/*"
                        />
                    </label>

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        rows={4}
                    />

                    {/* Tags */}
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />

                    {/* Upload Thumbnail */}
                    <label
                        htmlFor="thumbnail"
                        className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-4 hover:border-orange-500 transition"
                    >
                        {thumbnail ? (
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt={thumbnail.name}
                                className="w-full rounded-lg border border-gray-700 mb-2 object-cover"
                            />
                        ) : (
                            <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
                                Click to upload thumbnail
                            </div>
                        )}

                        <input
                            type="file"
                            id="thumbnail"
                            ref={thumbRef}
                            onChange={handleThumbnail}
                            className="hidden"
                            accept="image/*"
                        />
                    </label>

                    <button
                        className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
                        disabled={!title || !description || !tags || loading}
                        onClick={handleUploadVideo}
                    >
                        {loading ? <LoadingSpinner size={20} color="white" /> : "Upload Video"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateVideo;
