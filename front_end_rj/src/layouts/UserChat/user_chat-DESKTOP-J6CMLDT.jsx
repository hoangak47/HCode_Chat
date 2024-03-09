/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setInfo, setOpen } from '~/app/features/roomSlice';
import Topbar from '~/components/topbar';
import Chat from '~/components/chat';
import DetailProfile from '~/components/detailProfile';
import { SVG_ri_send_plane_2_fill } from '~/assets/SVG';
import { setMessage, setUser } from '~/app/features/userSlice';
import newInstanceAxios from '~/newInstanceAxios';
import { message } from 'antd';

async function getMessages(
    id,
    accessToken,
    user,
    dispatch,
    message_,
    page = 1,
    setCheckResultEmpty = null,
    navigate = null,
) {
    let axiosJWT = newInstanceAxios(accessToken, dispatch);

    await axiosJWT
        .get(`http://localhost:5000/api/v1/message/${id}/${page}`, {
            headers: {
                'x-access-token': accessToken,
                id: user._id,
            },
        })
        .then((res) => {
            if (res.data.length === 0) {
                if (setCheckResultEmpty) setCheckResultEmpty(true);
                return;
            }
            dispatch(setMessage([...message_, ...res.data]));
        })
        .catch((error) => {
            if (error.response?.status !== 401) {
                message.error('Your session has expired. Please log in again.');
                dispatch(setOpen(false));
                dispatch(setInfo(null));
                dispatch(setMessage([]));
                dispatch(setUser({}));
                navigate('/login');
            }
        });
}

async function getInfoRoom(id, accessToken, user, dispatch) {
    if (!id || !accessToken || !user) return;

    let axiosJWT = await newInstanceAxios(accessToken, dispatch);
    try {
        const res = await axiosJWT.get(`http://localhost:5000/api/v1/chat/${id}`, {
            headers: {
                'x-access-token': accessToken,
                id: user._id,
            },
        });

        dispatch(setInfo(res.data));
    } catch (error) {
        // console.log(error);
    }
}

function User_chat({ socketRef }) {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);
    const accessToken = useSelector((state) => state.user.accessToken);
    const message_ = useSelector((state) => state.user.message);

    const infoRoom = useSelector((state) => state.room.infoRoom);
    const userIsFriend = infoRoom?.isGroupChat ? null : infoRoom?.users?.find((item) => item._id !== user._id);

    const listMessage = useSelector((state) => state.room.room);

    const [page, setPage] = React.useState(1);
    const [checkResultEmpty, setCheckResultEmpty] = React.useState(false);

    React.useEffect(() => {
        if (Object.keys(user).length && params?.id) {
            setPage(1);
            setCheckResultEmpty(false);
            dispatch(setMessage([]));
            getMessages(params?.id, accessToken, user, dispatch, [], 1, setCheckResultEmpty, navigate);
            getInfoRoom(params?.id, accessToken, user, dispatch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    React.useEffect(() => {
        if (Object.keys(user).length && params?.id && !checkResultEmpty) {
            getMessages(params?.id, accessToken, user, dispatch, message_, page, setCheckResultEmpty, navigate);
            getInfoRoom(params?.id, accessToken, user, dispatch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, accessToken]);

    const openRoom = useSelector((state) => state.room.open);

    const handleSubmit = (e) => {
        e.preventDefault();

        const message = e.target.message.value;

        if (message) {
            socketRef.current.emit('send-message', {
                message,
                id: user._id,
                id_room: params.id,
                accessToken,
            });

            e.target.message.value = '';
        }
    };

    // const [openProfile, setOpenProfile] = React.useState(false);
    const openProfile = useSelector((state) => state.room.openProfile);

    return (
        <div
            className={`flex flex-1 lg:relative fixed h-full w-full lg:translate-x-0 transition-all duration-500 ease-in-out z-20 ${
                openRoom ? '' : 'translate-x-full'
            }`}
        >
            <div className={`flex flex-1 flex-col bg-white shadow-md`}>
                {infoRoom && (
                    <>
                        <Topbar
                            infoRoom={infoRoom}
                            setOpen={setOpen}
                            dispatch={dispatch}
                            openProfile={openProfile}
                            userIsFriend={userIsFriend}
                        />

                        <Chat message_={message_} user={user} page={page} setPage={setPage} />

                        <form className="flex px-6 py-7 border-t border-gray-200" onSubmit={(e) => handleSubmit(e)}>
                            <input
                                type="text"
                                placeholder="Enter your message..."
                                className="flex-1 px-4 py-2 text-sm text-gray-600 bg-fifth-color rounded-lg focus:outline-none focus:border-transparent"
                                name="message"
                                autoComplete="off"
                                autoFocus={true}
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center h-10 w-12 ml-3 cursor-pointer p-2 bg-current-color text-white rounded-md"
                            >
                                <SVG_ri_send_plane_2_fill height={16} width={16} />
                            </button>
                        </form>
                    </>
                )}
            </div>
            {openProfile && (
                <DetailProfile
                    infoRoom={infoRoom}
                    socketRef={socketRef}
                    user={user}
                    accessToken={accessToken}
                    listMessage={listMessage}
                    userIsFriend={userIsFriend}
                />
            )}
        </div>
    );
}

export default User_chat;
