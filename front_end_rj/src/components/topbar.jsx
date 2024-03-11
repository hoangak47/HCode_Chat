/* eslint-disable react/jsx-pascal-case */
import { Tooltip } from 'antd';
import React, { Fragment } from 'react';
import { setOpenProfile } from '~/app/features/roomSlice';
import {
    SVG_ri_arrow_left_s_line,
    SVG_ri_phone_line,
    SVG_ri_search_line,
    SVG_ri_vidicon_line,
    SVG_user_2_line,
} from '~/assets/SVG';

function Loadding() {
    return (
        <div className="flex items-center justify-between h-16 px-4 py-10 border-b border-gray-200">
            <div className="flex items-center">
                <div className="flex lg:hidden items-center justify-center h-10 w-10 cursor-pointer text-gray-400">
                    <SVG_ri_arrow_left_s_line height={20} width={20} />
                </div>
                <div className="flex-shrink-0">
                    <div className="relative w-10 h-10">
                        <div className="w-full h-full rounded-full bg-gray-200 text-current-color flex items-center justify-center"></div>
                    </div>
                </div>
                <div className="ml-3">
                    <p className="text-base font-semibold text-gray-900 text-line-1 w-12 bg-gray-200 rounded-sm h-4 mb-1"></p>
                    <p className="text-xs font-medium text-gray-500 w-8 bg-gray-200 rounded-sm h-4"></p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 ml-3 cursor-pointer">
                    <SVG_ri_search_line width={20} height={20} />
                </div>
                <div className="flex items-center justify-center h-10 w-10 ml-3 cursor-pointer">
                    <SVG_ri_phone_line width={20} height={20} />
                </div>
                <div className="flex items-center justify-center h-10 w-10 ml-3 cursor-pointer">
                    <SVG_ri_vidicon_line width={20} height={20} />
                </div>
                <div className="flex items-center justify-center h-10 w-10 ml-3 cursor-pointer">
                    <SVG_user_2_line width={20} height={20} />
                </div>
            </div>
        </div>
    );
}

function Topbar({ infoRoom, setOpen, dispatch, openProfile, userIsFriend, loading }) {
    const buttonActionMessage = [
        {
            key: 1,
            icon: <SVG_ri_search_line width={20} height={20} />,
            label: 'Search',
        },
        {
            key: 2,
            icon: <SVG_ri_phone_line width={20} height={20} />,
            label: 'Call',
        },
        {
            key: 3,
            icon: <SVG_ri_vidicon_line width={20} height={20} />,
            label: 'Video Call',
        },
        {
            key: 4,
            icon: <SVG_user_2_line width={20} height={20} />,
            label: 'Profile',
            onclick: () => dispatch(setOpenProfile(!openProfile)),
        },
    ];

    const [isOnline, setIsOnline] = React.useState(false);

    React.useEffect(() => {
        setIsOnline(infoRoom?.users?.find((user) => user.online === true) ? true : false);
    }, [infoRoom?.users]);

    return (
        <Fragment>
            {loading ? (
                <Loadding />
            ) : (
                <div className="flex items-center justify-between h-16 px-4 py-10 border-b border-gray-200">
                    <div className="flex items-center">
                        <div
                            className="flex lg:hidden items-center justify-center h-10 w-10 cursor-pointer text-gray-400"
                            onClick={() => dispatch(setOpen(false))}
                        >
                            <SVG_ri_arrow_left_s_line height={20} width={20} />
                        </div>
                        <div className="flex-shrink-0">
                            <div className="relative w-10 h-10">
                                {infoRoom?.isGroupChat ? (
                                    <>
                                        {infoRoom?.image ? (
                                            <img className="w-full h-full rounded-full" src={infoRoom?.image} alt="" />
                                        ) : (
                                            <div className="w-full h-full  rounded-full bg-current-color-hover text-current-color flex items-center justify-center ">
                                                {infoRoom?.name[0]}
                                            </div>
                                        )}

                                        {isOnline && (
                                            <span className="bottom-0 left-7 absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full h-full  rounded-full bg-current-color-hover text-current-color flex items-center justify-center ">
                                            {userIsFriend?.nickname[0] || userIsFriend?.username[0]}
                                        </div>

                                        {userIsFriend?.online && (
                                            <span className="bottom-0 left-7 absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="ml-3">
                            {infoRoom?.isGroupChat ? (
                                <>
                                    <p className="text-base font-semibold text-gray-900 text-line-1">
                                        {infoRoom?.name}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {infoRoom?.online
                                            ? 'Online'
                                            : infoRoom?.users.find((user) => user.online === true)
                                            ? 'Online'
                                            : 'Offline'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-base font-semibold text-gray-900 text-line-1">
                                        {userIsFriend?.nickname || userIsFriend?.username}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500">
                                        {userIsFriend?.online ? 'Online' : 'Offline'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {buttonActionMessage.map((item) => (
                            <Tooltip
                                key={item.key}
                                placement="top"
                                title={item.label}
                                color="#7a7f9a"
                                mouseLeaveDelay={0}
                            >
                                <div
                                    onClick={item.onclick ? item.onclick : null}
                                    className="flex items-center justify-center h-10 w-10 ml-3 cursor-pointer"
                                >
                                    {item.icon}
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Topbar;
