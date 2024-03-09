/* eslint-disable react/jsx-pascal-case */
import { Tooltip } from 'antd';
import React, { useRef } from 'react';
import { SVG_ri_time_line } from '~/assets/SVG';

function Chat({ message_, user, page, setPage }) {
    const listInnerRef = useRef();

    const onScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

        if (clientHeight - scrollHeight >= scrollTop && clientHeight - scrollHeight < -100) {
            setPage(page + 1);
        }
    };
    return (
        <div onScroll={onScroll} ref={listInnerRef} className="flex flex-col-reverse flex-1 overflow-y-auto ">
            {message_?.map((item, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-start px-4 py-2 ${
                        item?.sender && item?.sender._id === user._id ? 'items-end' : ''
                    }`}
                >
                    <div
                        className={`flex  flex-col px-6 py-3 rounded-lg mb-4 relative min-w-[50px] max-w-[70%] ${
                            item?.sender && item?.sender._id === user._id
                                ? 'bg-current-color text-white mr-7 items-start'
                                : 'bg-gray-200 text-black ml-7 items-end'
                        }`}
                    >
                        <span>{item?.message}</span>
                        <div className="flex items-center justify-center mt-2 text-gray-400">
                            <SVG_ri_time_line height={14} width={14} />
                            <span className="text-xs ml-1 font-medium">
                                {new Date(item?.timestamp).toLocaleTimeString().slice(0, 5)}
                            </span>
                        </div>
                        {item?.sender && item?.sender._id === user._id ? (
                            <div className="triangle-topright absolute -bottom-2 right-0"></div>
                        ) : (
                            <div className="triangle-topleft absolute -bottom-2 left-0"></div>
                        )}
                    </div>

                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            item?.sender && item?.sender._id === user._id
                                ? 'bg-current-color text-white'
                                : 'bg-gray-200 text-black'
                        }`}
                    >
                        <Tooltip
                            placement="top"
                            title={
                                item?.sender && item?.sender._id === user._id
                                    ? user?.username
                                    : item?.sender?.username || 'Tài khoản đã bị xóa'
                            }
                            color="#7a7f9a"
                            mouseLeaveDelay={0}
                        >
                            {item?.sender && item?.sender._id === user._id ? (
                                user?.image ? (
                                    <img
                                        className="cursor-pointer w-6 h-6 rounded-full inline-block"
                                        src={user?.image}
                                        alt="Rounded avatar"
                                    />
                                ) : (
                                    <div className="cursor-pointer w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )
                            ) : item?.sender && item?.sender?.image ? (
                                <img
                                    className="cursor-pointer w-6 h-6 rounded-full inline-block"
                                    src={item?.sender && item?.sender?.image}
                                    alt="Rounded avatar"
                                />
                            ) : (
                                <div className="cursor-pointer w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                    {item?.sender && item?.sender?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </Tooltip>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Chat;
