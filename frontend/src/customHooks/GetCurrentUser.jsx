import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';
import { setUserData } from '../redux/userSlice.js';

const GetCurrentUser = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_USER);
                if (res.data.success && res.data.user) {
                    dispatch(setUserData(res.data.user));
                } else {
                    dispatch(setUserData(null));
                }
            } catch (error) {
                // Error is handled by axios interceptor
                dispatch(setUserData(null));
            }
        };
        
        fetchUser();
    }, [dispatch]);
}

export default GetCurrentUser;