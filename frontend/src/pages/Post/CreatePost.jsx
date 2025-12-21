import { useState } from "react"
import { FaImage } from "react-icons/fa"
import api from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChannelData } from "../../redux/userSlice";

function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.CONTENT.CREATE_POST, {
        content,
        image
      })
      dispatch(
        setChannelData({
          ...(channelData || {}),
          communityPosts: [
            ...(channelData?.communityPosts || []),
            res.data.post,
          ],
        })
      );
      toast.success("Post Created!!")
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-5 items-center justify-center'>
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">

        <textarea
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-orange-500 focus:outline-none h-28"
          placeholder="Write something for your community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label htmlFor="image" className="flex items-center space-x-3 cursor-pointer">
          <FaImage className="text-2xl text-gray-300" />
          <span className="text-gray-300">Add Image(optional)</span>
          <input type="file" id="image" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>

        {image && (
          <div className="mt-3">
            <img src={URL.createObjectURL(image)} className="rounded-lg max-h-64 object-cover" />
          </div>
        )}

        <button
          onClick={handleCreatePost}
          disabled={!content || loading}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size={20} color="black" />
          ) : (
            "Create Playlist"
          )}</button>
      </div>
    </div>
  )
}

export default CreatePost