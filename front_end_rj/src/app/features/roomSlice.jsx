import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        room: [],
        open: false,
        infoRoom: null,
        openProfile: false,
    },
    reducers: {
        setRoom: (state, action) => {
            state.room = action.payload;
        },
        setOpen: (state, action) => {
            state.open = action.payload;
        },
        addRoom: (state, action) => {
            state.room = [action.payload, ...state.room];
        },
        setInfo: (state, action) => {
            state.infoRoom = action.payload;
        },
        setOpenProfile: (state, action) => {
            state.openProfile = action.payload;
        },
    },
});

export const { setRoom, setOpen, addRoom, setInfo, setOpenProfile } = roomSlice.actions;

export default roomSlice.reducer;
