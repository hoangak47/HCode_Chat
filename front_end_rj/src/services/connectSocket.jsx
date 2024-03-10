// import { io } from 'socket.io-client';

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';

// export const socketRef = io(URL);

import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

const URL = 'https://hcode-chat.onrender.com/';

export function useSocket() {
    const socketRef = useRef();

    // Use useSelector to get id and accessToken from your Redux store
    const user = useSelector((state) => state.user.user);
    const accessToken = useSelector((state) => state.user.accessToken);

    useEffect(() => {
        // Pass id and accessToken as query parameters in the connection
        socketRef.current = io(URL, {
            query: {
                id: user._id,
                accessToken,
            },
            withCredentials: true,
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [accessToken, user._id]);

    return socketRef;
}
