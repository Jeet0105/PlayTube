import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { setChannelData } from "../redux/userSlice";

const GetChannelData = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_CHANNEL);
                if (res.data.success && res.data.channel) {
                    dispatch(setChannelData(res.data.channel));
                } else {
                    dispatch(setChannelData(null));
                }
            } catch (error) {
                // Error is handled by axios interceptor
                console.log(error);               
                dispatch(setChannelData(null));
            }
        };
        
        fetchChannel();
    }, [dispatch]);
}

export default GetChannelData;