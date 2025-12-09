import { useState, useRef } from "react";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllShortData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

function CreateShort() {
    const [shortFile, setShortFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const { allShortData } = useSelector(state => state.content)
    const { channelData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const shortRef = useRef(null);

    const handleShortUpload = (e) => {
        setShortFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!shortFile || !title.trim()) {
            toast.error("Short and title are required.");
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
            formData.append("shortUrl", shortFile);

            const res = await api.post(API_ENDPOINTS.CONTENT.Create_Short, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Reset UI
            setShortFile(null);
            setTitle("");
            setDescription("");
            setTags("");

            if (shortRef.current) shortRef.current.value = "";

            if (res.status === 201) {
                dispatch(setAllShortData([...allShortData, res.data]))
                const updatedChannel = {
                    ...channelData,
                    shorts: [...(channelData.shorts || []), res.data]
                }
                dispatch(setChannelData(updatedChannel));
                navigate("/");
                toast.success("Short uploaded successfully");
            } else {
                toast.error(res.data.message || "Try again!!")
            }
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Failed to upload short.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5">
            <div className="flex flex-1 justify-center items-center px-4 py-6">
                <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">

                    {/* Upload Short Video */}
                    <label
                        htmlFor="short-video"
                        className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 hover:border-orange-500 transition"
                    >
                        {shortFile ? (
                            <p className="text-orange-400">{shortFile.name}</p>
                        ) : (
                            <p className="text-gray-400">
                                Click to upload short video (MP4, WebM)
                            </p>
                        )}

                        <input
                            type="file"
                            id="short-video"
                            ref={shortRef}
                            onChange={handleShortUpload}
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
                        placeholder="Description (optional)"
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

                    {/* Upload Button */}
                    <button
                        className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
                        disabled={!title || !shortFile || loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <LoadingSpinner size={20} color="white" /> : "Upload Short"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateShort;
