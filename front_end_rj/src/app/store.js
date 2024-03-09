import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import tabReducer from './features/tabSlice';
import roomReducer from './features/roomSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        tab: tabReducer,
        room: roomReducer,
    },
});
