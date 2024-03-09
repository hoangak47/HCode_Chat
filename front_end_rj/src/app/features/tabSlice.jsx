import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
    name: 'tab',
    initialState: {
        tab: 'Message',
    },
    reducers: {
        setTab: (state, action) => {
            state.tab = action.payload;
        },
    },
});

export const { setTab } = tabSlice.actions;

export default tabSlice.reducer;
