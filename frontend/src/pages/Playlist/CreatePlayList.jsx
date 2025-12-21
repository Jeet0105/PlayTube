import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

function CreatePlayList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (channelData?.video) {
      setVideoData(channelData.video);
    }
  }, [channelData]);

  const toggleVideoSelect = useCallback((videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  }, []);

  const handleCreatePlaylist = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (selectedVideos.length === 0) {
      toast.error("Select at least one video");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.CONTENT.CREATE_PLAYLIST, {
        title,
        description,
        videoIds: selectedVideos,
        visibility: "public",
      });

      dispatch(
        setChannelData({
          ...(channelData || {}),
          playlist: [
            ...(channelData?.playlist || []),
            res.data.playlist,
          ],
        })
      );

      toast.success("Playlist created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">

          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />

          <textarea
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />

          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>

            {videoData.length === 0 ? (
              <p className="text-sm text-gray-400">
                No videos found for this channel
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videoData.map((video) => (
                  <button
                    key={video._id}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleVideoSelect(video._id)}
                    className={`text-left rounded-lg overflow-hidden border-2 transition
                      ${selectedVideos.includes(video._id)
                        ? "border-orange-500"
                        : "border-gray-700"
                      }
                      ${loading ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-28 object-cover"
                    />
                    <p className="p-2 text-sm truncate">{video.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreatePlaylist}
            disabled={loading || !title || !description}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size={20} color="black" />
            ) : (
              "Create Playlist"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CreatePlayList;
