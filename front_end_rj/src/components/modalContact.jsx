/* eslint-disable react/jsx-pascal-case */
import { Modal, message } from 'antd';
import React from 'react';
import { setSearchResult } from '~/app/features/userSlice';
import { SVG_ri_search_line } from '~/assets/SVG';

export default function ModalContact({
    isModalOpen,
    spentRequest,
    user,
    search,
    setSearch,
    searchResult,
    socketRef,
    accessToken,
    dispatch,
    setIsModalOpen,
}) {
    const handleAccept = (id_table) => {
        socketRef.current?.emit('accept-friend', {
            id_table,
            id: user._id,
            accessToken,
        });

        message.success('Accept friend success');
    };

    const handleDecline = (id_table) => {
        socketRef.current?.emit('decline-friend', {
            id_table,
            id: user._id,
            accessToken,
        });

        message.success('Decline friend success');
    };

    const handleAddFriend = (id_friend) => {
        socketRef.current?.emit('add-friend', {
            id_user: user._id,
            id_friend: id_friend,
            id: user._id,
            accessToken: accessToken,
        });

        message.success('Request friend success');
    };

    const handleCancel = () => {
        setSearch(null);
        setIsModalOpen(false);
        dispatch(setSearchResult([]));
        setSearch(null);
    };

    return (
        <Modal title="Add friend" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <input
                        type="text"
                        className="flex-1 ml-4 py-2 px-4 rounded-lg border border-solid border-slate-300 focus:outline-none focus:border-slate-300"
                        placeholder="Search user"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search || ''}
                    />
                    <button className="flex items-center justify-center w-12 h-8">
                        <SVG_ri_search_line height={18} width={18} />
                    </button>
                </div>

                <div className="flex flex-col mt-4">
                    <span className="text-sm  mb-2">
                        {search ? 'Result' : spentRequest.length > 0 ? 'Waiting' : ''}
                    </span>

                    {search ? (
                        searchResult.length > 0 ? (
                            searchResult.map((item, index) => (
                                <div className="flex items-center justify-between" key={index}>
                                    <div className="flex items-center py-2 px-4">
                                        <div className="relative">
                                            {item?.image ? (
                                                <img className="w-8 h-8 rounded-full" src={item.image} alt="" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                                    {item.username[0]}
                                                </div>
                                            )}

                                            {item.online && (
                                                <div className="absolute bottom-0 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col ml-4">
                                            <span className="text-sm text-black font-semibold">{item.username}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {item.status === 'friend' ? (
                                            <button
                                                className="flex items-center justify-center rounded-lg px-5 py-1 text-white bg-red-500"
                                                onClick={() => handleDecline(item.id_table)}
                                            >
                                                <span>Delete</span>
                                            </button>
                                        ) : item.status === 'pending' ? (
                                            item.id_sender === user._id ? (
                                                <button
                                                    className="flex items-center justify-center bg-gray-500 rounded-lg px-5 py-1 text-white"
                                                    onClick={() => handleDecline(item.id_table)}
                                                >
                                                    <span>Cancel</span>
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="flex items-center justify-center bg-green-500 rounded-lg mr-4 px-5 py-1 text-white"
                                                        onClick={() => handleAccept(item.id_table)}
                                                    >
                                                        <span>Accept</span>
                                                    </button>

                                                    <button
                                                        className="flex items-center justify-center bg-red-500 rounded-lg px-5 py-1 text-white"
                                                        onClick={() => handleDecline(item.id_table)}
                                                    >
                                                        <span>Decline</span>
                                                    </button>
                                                </>
                                            )
                                        ) : (
                                            <button
                                                className="flex items-center justify-center bg-green-500 rounded-lg px-5 py-1 text-white"
                                                onClick={() => handleAddFriend(item._id)}
                                            >
                                                <span>Add</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-center text-gray-400">No result</span>
                        )
                    ) : (
                        spentRequest.map((item, index) => (
                            <div className="flex items-center justify-between" key={index}>
                                <div className="flex items-center py-2 px-4">
                                    <div className="relative">
                                        {item?.image ? (
                                            <img className="w-8 h-8 rounded-full" src={item.image} alt="" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                                {item.username[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col ml-4">
                                        <span className="text-sm text-black font-semibold">{item.username}</span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    {item.id_sender === user._id ? (
                                        <>
                                            <button
                                                className="flex items-center justify-center bg-gray-500 rounded-lg px-5 py-1 text-white"
                                                onClick={() => handleDecline(item.id_table)}
                                            >
                                                <span>Cancel</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="flex items-center justify-center bg-green-500 rounded-lg mr-4 px-5 py-1 text-white"
                                                onClick={() => handleAccept(item.id_table)}
                                            >
                                                <span>Accept</span>
                                            </button>

                                            <button
                                                className="flex items-center justify-center bg-red-500 rounded-lg px-5 py-1 text-white"
                                                onClick={() => handleDecline(item.id_table)}
                                            >
                                                <span>Decline</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
}
