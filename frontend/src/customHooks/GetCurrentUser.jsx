import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const GetCurrentUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/v1/user/get-user`, { withCredentials: true });
                console.log(res.data);
                dispatch(setUserData(res.data));
            } catch (error) {
                console.error("Error fetching user data:", error);
                dispatch(setUserData(null));
            }
        }
        fetchUser();
    }, []);
}

export default GetCurrentUser