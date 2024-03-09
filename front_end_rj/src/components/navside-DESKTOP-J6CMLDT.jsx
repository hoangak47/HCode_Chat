/* eslint-disable react/jsx-pascal-case */
import { Dropdown, Tooltip, message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setRoom } from '~/app/features/roomSlice';
import { setTab } from '~/app/features/tabSlice';
import { setAccessToken, setMessage, setUser } from '~/app/features/userSlice';
import { SVG_ri_global_line, SVG_ri_logout_circle_r_line, SVG_ri_moon_line, SVG_ri_profile_lin } from '~/assets/SVG';
import newInstanceAxios from '~/newInstanceAxios';
import { useSocket } from '~/services/connectSocket';

async function logout(id, accessToken, navigate, dispatch, socketRef) {
    try {
        let axiosJWT = await newInstanceAxios(accessToken, dispatch);
        await axiosJWT.get(`http://localhost:5000/api/v1/auth/logout?id=${id}`, {
            withCredentials: true,
            headers: {
                'x-access-token': accessToken,
            },
        });

        message.success('User logged out successfully');
        dispatch(setUser({}));
        dispatch(setTab('Message'));
        dispatch(setRoom([]));
        dispatch(setMessage([]));
        dispatch(setAccessToken(''));
        navigate('/login');
    } catch (error) {
        console.log(error);
    }
}

function Navside() {
    const socketRef = useSocket();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);
    const accessToken = useSelector((state) => state.user.accessToken);
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: (
                <div
                    className="flex w-[160px] px-4 justify-between items-center text-secondary-color"
                    onClick={() => {
                        dispatch(setTab('Profile'));
                    }}
                >
                    <label>Profile</label>
                    <SVG_ri_profile_lin width={16} height={16} />
                </div>
            ),
        },
        // {
        //     key: '2',
        //     label: (
        //         <div
        //             className="flex w-[160px] px-4 justify-between items-center text-secondary-color"
        //             onClick={() => {
        //                 dispatch(setTab('Setting'));
        //             }}
        //         >
        //             <label>Setting</label>
        //             <SVG_ri_settings_3_line width={16} height={16} />
        //         </div>
        //     ),
        // },
        {
            type: 'divider',
            style: {
                backgroundColor: 'rgba(156,163,175,1)',
            },
        },
        {
            key: '3',
            label: (
                <div
                    className="flex w-[160px] px-4 justify-between items-center text-secondary-color"
                    onClick={() => {
                        logout(user?._id, accessToken, navigate, dispatch, socketRef);
                    }}
                >
                    <label>Logout</label>
                    <SVG_ri_logout_circle_r_line width={16} height={16} />
                </div>
            ),
        },
    ];

    return (
        <div className="flex lg:flex-col flex-row">
            <div className="p-4 lg:mb-2 cursor-pointer sm:inline-block hidden">
                <SVG_ri_global_line width={24} height={24} />
            </div>
            <Tooltip placement="top" title="Dark / Light mode" color="#7a7f9a" mouseLeaveDelay={0}>
                <div className="p-4 lg:mb-2 cursor-pointer sm:inline-block hidden">
                    <SVG_ri_moon_line width={24} height={24} />
                </div>
            </Tooltip>
            <div className="p-4 lg:mb-2 cursor-pointer">
                <Dropdown menu={{ items }} placement="topLeft" arrow>
                    {user?.image ? (
                        <img className="w-6 h-6 rounded-full inline-block" src={user?.image} alt="Rounded avatar" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </Dropdown>
            </div>
        </div>
    );
}

export default Navside;
