/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import React, { Fragment } from 'react';
import { SVG_ri_user_add_line } from '~/assets/SVG';
import FormSearch from './formSearch';
import { Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '~/app/features/roomSlice';
import { useDebounce } from '@uidotdev/usehooks';
import { getListsFriend } from '~/pages/Login/login';
import { setSearchResult } from '~/app/features/userSlice';
import ModalContact from './modalContact';
import newInstanceAxios from '~/newInstanceAxios';

const searchUser = async (id, search, accessToken, dispatch, navigate) => {
    let axiosJWT = await newInstanceAxios(accessToken, dispatch, navigate);
    try {
        const res = await axiosJWT.get(`http://localhost:5000/api/v1/search?search=${search}`, {
            headers: {
                'x-access-token': accessToken,
                id,
            },
        });

        dispatch(setSearchResult(res.data));
    } catch (error) {
        console.log(error);
    }
};

function Contacts({ socketRef }) {
    const user = useSelector((state) => state.user.user);
    const listFriend = useSelector((state) => state.user.listFriend);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.user.accessToken);

    const [friends, setFriends] = React.useState(null);
    const notificationListFriend = listFriend?.filter(
        (item) => item.status === 'pending' && item.id_sender !== user._id,
    ).length;

    React.useEffect(() => {
        if (!listFriend) return;
        const data = listFriend.reduce((groups, friend) => {
            if (friend.status === 'pending') return groups;
            const letter = friend.username.charAt(0);

            if (!groups[letter]) {
                groups[letter] = [];
            }
            groups[letter].push(friend);
            return groups;
        }, {});
        setFriends(data);
    }, [listFriend]);

    React.useEffect(() => {
        getListsFriend(accessToken, user, dispatch);
    }, []);

    const params = useParams();

    const handleClick = (item) => {
        const users = [user._id, item._id];

        const data = {
            users,
            userCreate: user._id,
            id: user._id,
            accessToken: accessToken,
        };

        socketRef.current?.emit('add-room', data);

        dispatch(setOpen(true));
    };

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const [spentRequest, setSpentRequest] = React.useState([]);

    React.useEffect(() => {
        setSpentRequest(listFriend.filter((item) => item.status === 'pending'));
    }, [listFriend]);

    const [search, setSearch] = React.useState(null);
    const searchResult = useSelector((state) => state.user.searchResult);
    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => {
        dispatch(setSearchResult([]));
        if (!debouncedSearch) {
            return;
        }

        searchUser(user._id, debouncedSearch, accessToken, dispatch, navigate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, accessToken]);

    return (
        <>
            <div className="flex py-2 px-4 items-center justify-between">
                <span className="text-xl text-black font-semibold">Contacts</span>
                <div className="flex items-center relative" onClick={showModal}>
                    <button className="flex items-center justify-center w-12 h-8">
                        <SVG_ri_user_add_line height={18} width={18} />
                    </button>

                    {notificationListFriend > 0 && (
                        <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-white flex items-center justify-center">
                            <span className="text-xs">{notificationListFriend}</span>
                        </div>
                    )}
                </div>

                <ModalContact
                    isModalOpen={isModalOpen}
                    spentRequest={spentRequest}
                    search={search}
                    setSearch={setSearch}
                    searchResult={searchResult}
                    user={user}
                    accessToken={accessToken}
                    socketRef={socketRef}
                    setIsModalOpen={setIsModalOpen}
                    dispatch={dispatch}
                />
            </div>

            <div className="flex flex-col px-4 flex-1 overflow-hidden">
                <FormSearch placeHolder="Search users" />

                <Divider className="lg:my-4" />

                <div className="flex flex-col flex-1 overflow-y-auto list-message">
                    {friends !== null &&
                        Object.keys(friends)
                            .sort()
                            .map((key, index) => (
                                <div key={index}>
                                    <div className="flex items-center py-2 px-4 sticky top-0 bg-white z-10 shadow-sm">
                                        <span className="text-sm text-gray-400">{key}</span>
                                    </div>
                                    {friends[key].map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center hover:bg-fifth-color rounded-sm py-2 px-4 transition-all delay-75 cursor-pointer mb-4
                  ${params.id === message._id ? 'bg-fifth-color' : 'bg-transparent'}
                  `}
                                            onClick={() => {
                                                handleClick(message);
                                            }}
                                        >
                                            <div className="relative">
                                                {message?.image ? (
                                                    <img className="w-8 h-8 rounded-full" src={message.image} alt="" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                                        {message.username[0]}
                                                    </div>
                                                )}
                                                {/* {message.online && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                )} */}
                                            </div>
                                            <div className="flex flex-col ml-4">
                                                <span className="text-sm text-black font-semibold">
                                                    {message.username}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                </div>
            </div>
        </>
    );
}

export default Contacts;
