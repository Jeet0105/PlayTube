import { useEffect, useState } from "react"
import { API_ENDPOINTS } from "../../utils/constants";
import api from "../../utils/axios";
import { FaList } from "react-icons/fa"
import PlaylistCard from "../../component/PlaylistCard";

function SavedPlayList() {
    const [savedPlaylist, setSavedPlaylist] = useState([]);

    useEffect(() => {
        const fetchSavedPlaylist = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.CONTENT.GET_SAVED_PLAYLIST);
                setSavedPlaylist(res.data.savedPlayLists);
            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedPlaylist();
    }, [])

    if (!savedPlaylist || savedPlaylist.length) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
                No Saved Playlist Found
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen bg-black text-white mt-10 lg:mt-5">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FaList className="w-6 h-6 text-orange-600" />
                Saved Playlist
            </h2>
            <div className="flex flex-wrap gap-6">
                {savedPlaylist?.map((pl)=>(
                    <PlaylistCard
                        key={pl._id}
                        id={pl._id}
                        title={pl.title}
                        videos={pl.video}
                        saveBy={pl.saveBy}
                    />
                ))}
            </div>
        </div>
    )
}

export default SavedPlayList