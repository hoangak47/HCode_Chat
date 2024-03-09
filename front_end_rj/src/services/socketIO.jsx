import io from 'socket.io-client';

let socket;

export const initiateSocket = (id, accessToken) => {
    socket = io('http://localhost:5000', {
        query: {
            id,
            accessToken,
        },
        withCredentials: true,
    });
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};

export const subscribeToChat = (cb) => {
    if (!socket) return true;
    socket.on('chat', (msg) => {
        console.log('Websocket event received!');
        return cb(null, msg);
    });
};
