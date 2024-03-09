/* eslint-disable react/jsx-pascal-case */
import { Dropdown, Tooltip } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTab } from '~/app/features/tabSlice';
import {
    SVG_ri_global_line,
    SVG_ri_logout_circle_r_line,
    SVG_ri_moon_line,
    SVG_ri_profile_lin,
    SVG_ri_settings_3_line,
} from '~/assets/SVG';

function Navside() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

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
        {
            key: '2',
            label: (
                <div
                    className="flex w-[160px] px-4 justify-between items-center text-secondary-color"
                    onClick={() => {
                        dispatch(setTab('Setting'));
                    }}
                >
                    <label>Setting</label>
                    <SVG_ri_settings_3_line width={16} height={16} />
                </div>
            ),
        },
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
                        console.log('logout');
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
