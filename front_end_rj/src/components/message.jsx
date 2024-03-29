import { Divider } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import FormSearch from './formSearch';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen, setRoom } from '~/app/features/roomSlice';
import newInstanceAxios from '~/newInstanceAxios';
import { url } from '~/App';

const LoaddingListMess = () => {
    return (
        <div className="flex flex-col mt-4 flex-1 overflow-y-auto">
            {Array(5)
                .fill(0)
                .map((_, index) => {
                    return (
                        <div
                            key={index}
                            className="flex items-center hover:bg-fifth-color rounded-sm py-2 px-4 transition-all delay-75 cursor-pointer mb-4 bg-transparent"
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-current-color flex items-center justify-center"></div>
                            </div>
                            <div className="flex items-center flex-1 flex-col ml-4">
                                <div className="w-full h-6 bg-gray-200 rounded-sm"></div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

async function getListMessage(accessToken, user, axiosJWT, dispatch) {
    try {
        const res = await axiosJWT.get(`${url}api/v1/chat/`, {
            headers: {
                'x-access-token': accessToken,
                id: user._id,
            },
        });
        dispatch(setRoom(res.data));
    } catch (err) {
        // console.log(err);
    }
}

function Message() {
    const params = useParams();

    const [moveToListMessage, setMoveToListMessage] = React.useState(false);

    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.user.accessToken);
    const user = useSelector((state) => state.user.user);

    const listMessage = useSelector((state) => state.room.room);

    let axiosJWT = newInstanceAxios(accessToken, dispatch);

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (listMessage.length > 0) return;
        setLoading(true);
        getListMessage(accessToken, user, axiosJWT, dispatch).then(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listMessage]);

    return (
        <>
            <div className="flex py-2 px-4 items-center justify-between">
                <span className="text-xl text-black font-semibold">Chats</span>
                <div className="h-8"></div>
            </div>
            <div className="flex flex-col px-4 flex-1 overflow-hidden">
                <FormSearch placeHolder="Search messages or users" />

                <Divider className="lg:my-4" />
                <div
                    onMouseMove={() => setMoveToListMessage(true)}
                    onMouseLeave={() => setMoveToListMessage(false)}
                    className={`flex flex-col mt-4 flex-1 overflow-y-auto ${moveToListMessage ? '' : 'list-message'}`}
                >
                    {loading ? (
                        <LoaddingListMess />
                    ) : (
                        listMessage?.map((message) => {
                            return (
                                <Link
                                    to={`/${message?._id}`}
                                    onClick={() => dispatch(setOpen(true))}
                                    key={message?._id}
                                    className={`flex items-center hover:bg-fifth-color rounded-sm py-2 px-4 transition-all delay-75 cursor-pointer mb-4 ${
                                        params.id === message?._id ? 'bg-fifth-color' : 'bg-transparent'
                                    }`}
                                >
                                    <div className="relative">
                                        {message?.image ? (
                                            <img className="w-8 h-8 rounded-full" src={message?.image} alt="" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                                {message?.name
                                                    ? message?.name[0]
                                                    : !message?.isGroupChat
                                                    ? message?.users.find((user_) => user_._id !== user._id).username[0]
                                                    : ''}
                                            </div>
                                        )}

                                        {message?.online && (
                                            <span className="bottom-0 left-6 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex items-center flex-1 flex-col ml-4">
                                        <div className="flex w-full items-center justify-between">
                                            <span className="text-black text-base font-semibold">
                                                {message?.isGroupChat ? '#' : ''}
                                                {message?.name
                                                    ? message?.name
                                                    : message?.users.find((user_) => user_._id !== user._id)
                                                          .nickname !== ''
                                                    ? message?.users.find((user_) => user_._id !== user._id).nickname
                                                    : message?.users.find((user_) => user_._id !== user._id).username}
                                            </span>
                                            <span className="text-gray-500 text-xs">{message?.time}</span>
                                        </div>
                                        <div className="flex w-full items-center justify-between">
                                            <span className="text-gray-500 text-sm">{message?.lastMessage}</span>
                                            {message?.notification > 0 ? (
                                                <span className="text-[10px] rounded-full w-7 h-5 text-red-500 bg-red-200 flex items-center justify-center mt-2">
                                                    {message?.notification}
                                                </span>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}

export default Message;
