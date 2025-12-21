import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { setAllChannelData, setChannelData } from "../redux/userSlice";

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
                console.log(error);
                dispatch(setChannelData(null));
            }
        };

        fetchChannel();
    }, [dispatch]);

    useEffect(() => {
        const fetchAllChannel = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_ALL_CHANNEL);
                if (res.data.success && res.data.channels) {
                    dispatch(setAllChannelData(res.data.channels));
                } else {
                    dispatch(setAllChannelData(null));
                }
            } catch (error) {
                console.log(error);
                dispatch(setAllChannelData(null));
            }
        };

        fetchAllChannel();
    }, [dispatch]);
}

export default GetChannelData;