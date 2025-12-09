import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        allVideosData: null,
        allShortData: null
    },
    reducers: {
        setAllVideosData: (state, action) => {
            state.allVideosData = action.payload
        },
        setAllShortData: (state, action) => {
            state.allShortData = action.payload
        },
    }
})

export const { setAllShortData } = contentSlice.actions
export const { setAllVideosData } = contentSlice.actions
export default contentSlice.reducer