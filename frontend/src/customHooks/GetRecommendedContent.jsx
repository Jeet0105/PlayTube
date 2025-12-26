import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { setRecommendedContent } from "../redux/userSlice";

export const GetRecommendedContent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRecommendedContent = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.USER.GET_RECOMMENDATION);
                if (res.data.success && res.data.data) {
                    dispatch(setRecommendedContent(res.data.data))
                } else {
                    dispatch(setRecommendedContent(null));
                }
            } catch (error) {
                console.log(error);
                dispatch(setRecommendedContent(null));
            }
        };

        fetchRecommendedContent();
    }, [dispatch]);
}
