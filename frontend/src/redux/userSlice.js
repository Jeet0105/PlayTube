import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        channelData: null,
        allChannelData: null,
        subscribedChannels: null,
        subscribedVideos: null,
        subscribedShorts: null,
        subscribedPosts: null,
        subscribedPlaylists: null,
        videoHistory: null,
        shortHistory: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setChannelData: (state, action) => {
            state.channelData = action.payload;
        },
        setAllChannelData: (state, action) => {
            state.allChannelData = action.payload;
        },
        setSubscribedChannels: (state, action) => {
            state.subscribedChannels = action.payload;
        },
        setSubscribedVideos: (state, action) => {
            state.subscribedVideos = action.payload;
        },
        setSubscribedShorts: (state, action) => {
            state.subscribedShorts = action.payload;
        },
        setSubscribedPlaylists: (state, action) => {
            state.subscribedPlaylists = action.payload;
        },
        setSubscribedPosts: (state, action) => {
            state.subscribedPosts = action.payload;
        },
        setVideoHistory: (state, action) => {
            state.videoHistory = action.payload;
        },
        setShortHistory: (state, action) => {
            state.shortHistory = action.payload;
        },
    }
});

export const { 
    setUserData, 
    setChannelData, 
    setAllChannelData, 
    setSubscribedChannels, 
    setSubscribedPlaylists, 
    setSubscribedPosts, 
    setSubscribedShorts, 
    setSubscribedVideos ,
    setVideoHistory,
    setShortHistory
} = userSlice.actions;
export default userSlice.reducer;
