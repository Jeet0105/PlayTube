import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Content() {
  const { channelData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Videos");

  const tabs = ["Videos", "Shorts", "Playlists", "Community Posts"];

  return (
    <div className="text-white min-h-screen pt-5 px-4 sm:px-6 mb-16">

      {/* Tabs */}
      <div className="flex flex-wrap gap-6 border-b border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`pb-3 text-sm sm:text-base font-medium cursor-pointer ${
              activeTab === tab
                ? "border-b-2 border-orange-600 text-white"
                : "text-gray-400 hover:text-white/80 hover:scale-105 transition"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========= VIDEOS ========= */}
      {activeTab === "Videos" && (
        <div className="space-y-4">
          {!channelData?.video?.length && (
            <p className="text-gray-400">No videos yet.</p>
          )}

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Thumbnail</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Views</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channelData?.video?.map((video) => (
                  <tr key={video._id} className="border-t border-gray-700 hover:bg-gray-900/50 transition">
                    <td className="p-3">
                      <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded" />
                    </td>
                    <td className="p-3">{video.title}</td>
                    <td className="p-3">{video.views}</td>
                    <td className="p-3 flex items-center gap-4">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 md:hidden">
            {channelData?.video?.map((video) => (
              <div key={video._id} className="bg-[#1c1c1c] rounded-xl hover:shadow-lg transition overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium">{video.title}</h3>
                  <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>{video.views} views</span>
                    <div className="flex gap-3">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========= SHORTS ========= */}
      {activeTab === "Shorts" && (
        <div className="space-y-4">
          {!channelData?.shorts?.length && (
            <p className="text-gray-400">No shorts yet.</p>
          )}

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Preview</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Views</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channelData?.shorts?.map((video) => (
                  <tr key={video._id} className="border-t border-gray-700 hover:bg-gray-900/50 transition">
                    <td className="p-3">
                      <video src={video?.shortUrl} className="w-16 h-24 bg-black rounded" muted playsInline />
                    </td>
                    <td className="p-3">{video.title}</td>
                    <td className="p-3">{video.views}</td>
                    <td className="p-3 flex items-center gap-4">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 md:hidden">
            {channelData?.shorts?.map((video) => (
              <div key={video._id} className="bg-[#1c1c1c] rounded-xl hover:shadow-lg transition overflow-hidden flex flex-col border border-gray-400">
                <video src={video?.shortUrl} className="w-full" muted playsInline controls />
                <div className="p-4">
                  <h3 className="font-medium">{video.title}</h3>
                  <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>{video.views} views</span>
                    <div className="flex gap-3">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========= PLAYLISTS ========= */}
      {activeTab === "Playlists" && (
        <div className="space-y-4">
          {!channelData?.playlist?.length && (
            <p className="text-gray-400">No playlists yet.</p>
          )}

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Preview</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Total Videos</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channelData?.playlist?.map((pl) => (
                  <tr key={pl._id} className="border-t border-gray-700 hover:bg-gray-900/50 transition">
                    <td className="p-3">
                      <img src={pl?.thumbnail} alt={pl.title} className="w-20 h-12 object-cover rounded" />
                    </td>
                    <td className="p-3">{pl.title}</td>
                    <td className="p-3">{pl?.video?.length ?? 0}</td>
                    <td className="p-3 flex items-center gap-4">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 md:hidden">
            {channelData?.playlist?.map((pl) => (
              <div key={pl._id} className="bg-[#1c1c1c] rounded-xl hover:shadow-lg transition overflow-hidden">
                <img src={pl.thumbnail} alt={pl.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium">{pl.title}</h3>
                  <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>{pl?.video?.length ?? 0} videos</span>
                    <div className="flex gap-3">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========= COMMUNITY POSTS ========= */}
      {activeTab === "Community Posts" && (
        <div className="space-y-4">
          {!channelData?.communityPosts?.length && (
            <p className="text-gray-400">No community posts yet.</p>
          )}

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Post</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {channelData?.communityPosts?.map((post) => (
                  <tr key={post._id} className="border-t border-gray-700 hover:bg-gray-900/50 transition">
                    <td className="p-3">
                      {post.image ? (
                        <img src={post.image} alt="post" className="w-20 h-12 object-cover rounded" />
                      ) : (
                        <p>No Image</p>
                      )}
                    </td>
                    <td className="p-3">{post.content}</td>
                    <td className="p-3">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex items-center gap-4">
                      <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                      <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 md:hidden">
            {channelData?.communityPosts?.map((post) => (
              <div key={post._id} className="bg-[#1c1c1c] rounded-xl hover:shadow-lg transition overflow-hidden p-4">
                {post.image && (
                  <img src={post.image} alt="post" className="w-full h-40 object-cover rounded mb-3" />
                )}
                <p className="text-sm">{post.content}</p>
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-3">
                    <button className="text-blue-500 hover:text-blue-600"><FaEdit size={18} /></button>
                    <button className="text-red-500 hover:text-red-600"><MdDelete size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
