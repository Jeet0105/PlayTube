import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';
import { setSubscribedChannels, setSubscribedPlaylists, setSubscribedPosts, setSubscribedShorts, setSubscribedVideos } from '../redux/userSlice';

const GetSubscribedData = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubscribedData = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_SUBSCRIBED_DATA);
                if (res.data.success) {
                    dispatch(setSubscribedChannels(res.data.subscribedChannels));
                    dispatch(setSubscribedPlaylists(res.data.playlist));
                    dispatch(setSubscribedPosts(res.data.posts));
                    dispatch(setSubscribedShorts(res.data.shorts))
                    dispatch(setSubscribedVideos(res.data.videos));
                } else {
                    dispatch(setSubscribedChannels(null));
                    dispatch(setSubscribedPlaylists(null));
                    dispatch(setSubscribedPosts(null));
                    dispatch(setSubscribedShorts(null))
                    dispatch(setSubscribedVideos(null));
                }
            } catch (error) {
                console.log(error);
                dispatch(setSubscribedChannels(null));
                dispatch(setSubscribedPlaylists(null));
                dispatch(setSubscribedPosts(null));
                dispatch(setSubscribedShorts(null))
                dispatch(setSubscribedVideos(null));
            }
        };

        fetchSubscribedData();
    }, [dispatch]);
}

export default GetSubscribedData;