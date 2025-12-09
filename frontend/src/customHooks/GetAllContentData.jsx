import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_ENDPOINTS } from "../utils/constants";
import api from "../utils/axios";
import { setAllShortData, setAllVideosData } from "../redux/contentSlice";

const GetAllContentData = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch videos
                const videosRes = await api.get(API_ENDPOINTS.CONTENT.Get_All_Videos);
                dispatch(
                    videosRes.data.success && videosRes.data.videos
                        ? setAllVideosData(videosRes.data.videos)
                        : setAllVideosData(null)
                );

                // Fetch shorts
                const shortsRes = await api.get(API_ENDPOINTS.CONTENT.Get_All_Shorts);
                dispatch(
                    shortsRes.data.success && shortsRes.data.shorts
                        ? setAllShortData(shortsRes.data.shorts)
                        : setAllShortData(null)
                );
                
            } catch (err) {
                console.log(err);
                dispatch(setAllVideosData(null));
                dispatch(setAllShortData(null));
            }
        };

        fetchContent();
    }, [dispatch]);
};

export default GetAllContentData;
