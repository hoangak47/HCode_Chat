import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        accessToken: '',
        listFriend: [],
        searchResult: [],
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
    },
});

export const { setUser, setAccessToken, setListFriend, setSearchResult } = userSlice.actions;

export default userSlice.reducer;
