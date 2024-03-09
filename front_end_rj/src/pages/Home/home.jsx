/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import { message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addRoom, setInfo, setOpen, setOpenProfile, setRoom } from '~/app/features/roomSlice';
import { setAccessToken, setListFriend, setSearchResult, setUser } from '~/app/features/userSlice';
import Side_chat from '~/layouts/SideChat/side_chat';
import Side_menu from '~/layouts/SideMenu/side_menu';
import User_chat from '~/layouts/UserChat/user_chat';
import { useSocket } from '~/services/connectSocket';

function Home() {
    const socketRef = useSocket();
    const user = useSelector((state) => state.user.user);
    const params = useParams();
    const accessToken = useSelector((state) => state.user.accessToken);

    const listMessage = useSelector((state) => state.room.room);
    const listFriend = useSelector((state) => state.user.listFriend);
    const searchResult = useSelector((state) => state.user.searchResult);
    const infoRoom = useSelector((state) => state.room.infoRoom);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!Object.keys(user).length) {
            navigate('/login');
        }

        if (listMessage.length > 0 && !params.id) {
            navigate(`/${listMessage[0]?._id}`);
        }
    }, [listMessage, navigate, params.id, user]);

    React.useEffect(() => {
        socketRef.current?.emit('online', user._id);
        socketRef.current?.on('new-access-token', (data) => {
            if (data.id !== user._id) return;
            dispatch(setAccessToken(data.accessToken));
        });

        socketRef.current?.on('error', async (error) => {
            if (error.message === 'Unauthorized' && error.id === user._id) {
                message.error('Your session has expired. Please log in again.');
                navigate('/login');
                dispatch(setUser({}));
            } else {
                console.log(error);
            }
        });

        socketRef.current?.on('receive-add-room', (data) => {
            if (data.userCreate === user._id) {
                data.users.find((item) => {
                    if (item._id === user._id) {
                        dispatch(addRoom(data));
                        navigate(`/${data._id}`);
                    }
                });
            } else {
                data.users.find((item) => {
                    if (item._id === user._id) {
                        dispatch(addRoom(data));
                    }
                });
            }
        });

        socketRef.current?.on('receive-room-exist', (data) => {
            navigate(`/${data._id}`);
        });

        socketRef.current?.on('receive-add-friend', (data) => {
            if (data.id_user === user._id) {
                dispatch(
                    setListFriend([
                        ...listFriend,
                        {
                            id_table: data.friendPopulate._id,
                            status: data.friendPopulate.status,
                            id_sender: data.id_user,
                            ...data.friendPopulate.id_friend,
                        },
                    ]),
                );
            } else if (data.id_friend === user._id) {
                dispatch(
                    setListFriend([
                        ...listFriend,
                        {
                            id_table: data.friendPopulate._id,
                            status: data.friendPopulate.status,
                            id_sender: data.id_user,
                            ...data.friendPopulate.id_user,
                        },
                    ]),
                );
            }

            const updatedSearchResult = searchResult.map((item) => {
                if (item._id === data.id_user || item._id === data.id_friend) {
                    return {
                        ...item,
                        status: data.friendPopulate.status,
                        id_sender: data.id_user,
                        id_table: data.friendPopulate._id,
                    };
                }
                return item;
            });

            dispatch(setSearchResult(updatedSearchResult));
        });
        socketRef.current?.on('receive-leave-room', (data) => {
            const findRoom = listMessage.find((item) => item._id === data);

            if (findRoom) {
                const updatedListMessage = listMessage.filter((item) => {
                    if (item._id !== data) {
                        return item;
                    }
                });

                dispatch(setRoom(updatedListMessage));
                if (params.id === data) {
                    dispatch(setInfo(null));
                    dispatch(setOpenProfile(false));
                    dispatch(setOpen(false));
                    navigate(`/${updatedListMessage.length > 0 ? updatedListMessage[0]._id : ''}`);
                }
            }
        });

        socketRef.current?.on('receive-update-member', (data) => {
            if (user._id === data.id_user) {
                const updatedListMessage = listMessage.filter((item) => {
                    if (item._id !== data.id_room) {
                        return item;
                    }
                });

                dispatch(setRoom(updatedListMessage));
                dispatch(setInfo(null));
                dispatch(setOpenProfile(false));
                dispatch(setOpen(false));
                navigate(`/${updatedListMessage.length > 0 ? updatedListMessage[0]._id : ''}`);
            } else {
                const findRoom = listMessage.find((item) => item._id === data.id_room);

                if (findRoom) {
                    dispatch(
                        setInfo({
                            ...infoRoom,
                            users: infoRoom?.users?.filter((item) => item._id !== data.id_user),
                        }),
                    );
                }
            }
        });

        socketRef.current?.on('receive-accept-friend', (data) => {
            const updatedListFriend = listFriend.map((item) => {
                if (data._id === item.id_table) {
                    return { ...item, status: 'friend' };
                }

                return item;
            });

            dispatch(setListFriend(updatedListFriend));

            const updatedSearchResult = searchResult.map((item) => {
                if (item.id_table === data._id) {
                    return { ...item, status: 'friend' };
                }
                return item;
            });

            dispatch(setSearchResult(updatedSearchResult));
        });

        socketRef.current?.on('receive-decline-friend', (data) => {
            const updatedListFriend = listFriend.filter((item) => data !== item.id_table);

            const updatedSearchResult = searchResult.map((item) => {
                if (item.id_table === data) {
                    return { ...item, status: 0 };
                }
                return item;
            });

            dispatch(setSearchResult(updatedSearchResult));

            dispatch(setListFriend(updatedListFriend));
        });

        return () => {
            socketRef.current?.off('new-access-token');
            socketRef.current?.off('error');
            socketRef.current?.off('receive-add-room');
            socketRef.current?.off('receive-room-exist');
            socketRef.current?.off('receive-add-friend');
            socketRef.current?.off('receive-leave-room');
            socketRef.current?.off('receive-update-member');
            socketRef.current?.off('receive-accept-friend');
            socketRef.current?.off('receive-decline-friend');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketRef.current, accessToken, listMessage, infoRoom, listFriend, searchResult]);

    React.useEffect(() => {
        socketRef.current?.on('room-update', (id) => {
            let listRooms = [];
            for (let i = 0; i < listMessage.length; i++) {
                if (listMessage[i]._id === id) {
                    listRooms.unshift(listMessage[i]);
                } else {
                    listRooms.push(listMessage[i]);
                }
            }

            dispatch(setRoom(listRooms));
        });

        socketRef.current?.on('receive-set-nickname', (data) => {
            const updatedListMessage = listMessage.map((item) => {
                if (item._id === params.id) {
                    return {
                        ...item,
                        users: item.users.map((user) =>
                            user._id === data.id_user ? { ...user, nickname: data.nickname } : user,
                        ),
                    };
                }
                return item;
            });

            dispatch(setRoom(updatedListMessage));
        });

        socketRef.current?.on('receive-edit-room', (data) => {
            dispatch(setInfo(data));
            dispatch(setRoom(listMessage.map((item) => (item._id === data._id ? data : item))));
        });

        return () => {
            socketRef.current?.off('receive-set-nickname');
            socketRef.current?.off('receive-edit-room');
        };
    }, [listMessage, params.id]);

    return (
        <div className="flex w-screen overflow-hidden flex-col-reverse lg:flex-row h-screen">
            <Side_menu />
            <div className="flex w-full lg:h-full h-[calc(100vh-3.5rem)] relative">
                <Side_chat socketRef={socketRef} />
                <User_chat socketRef={socketRef} />
            </div>
        </div>
    );
}

// export socketRef

export default Home;
