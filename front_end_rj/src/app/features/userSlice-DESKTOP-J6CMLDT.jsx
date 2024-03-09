import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        accessToken: '',
        listFriend: [],
        searchResult: [],
        message: [],
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setListFriend: (state, action) => {
            state.listFriend = action.payload;
        },
        setSearchResult: (state, action) => {
            state.searchResult = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    },
});

export const { setUser, setAccessToken, setListFriend, setSearchResult, setMessage } = userSlice.actions;

export default userSlice.reducer;
