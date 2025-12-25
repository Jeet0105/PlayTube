import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';
import { setVideoHistory, setShortHistory } from '../redux/userSlice';

const GetHistory = () => {
  const dispatch = useDispatch();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_HISTORY);
                if (res.data.success) {
                    const history = res.data.userHistory;
                    const videoHistory = history.filter(item => item.contentType === 'Video');
                    const shortHistory = history.filter(item => item.contentType === 'Short');
                    dispatch(setVideoHistory(videoHistory));
                    dispatch(setShortHistory(shortHistory));
                } else {
                    setVideoHistory(null);
                    setShortHistory(null);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchHistory();
    }, [dispatch]);
}

export default GetHistory;