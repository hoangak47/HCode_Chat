/* eslint-disable react/jsx-pascal-case */
import { Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTab } from '~/app/features/tabSlice';
import { SVG_ri_contacts_line, SVG_ri_group_line, SVG_ri_message_3_line, SVG_user_2_line } from '~/assets/SVG';

const arrTabs = [
    {
        key: 1,
        // icon: SVG_user_2_line(24, 24),
        icon: <SVG_user_2_line width={24} height={24} />,
        label: 'Profile',
    },
    {
        key: 2,
        // icon: SVG_ri_message_3_line(24, 24),
        icon: <SVG_ri_message_3_line width={24} height={24} />,
        label: 'Message',
    },
    {
        key: 3,
        // icon: SVG_ri_group_line(24, 24),
        icon: <SVG_ri_group_line width={24} height={24} />,
        label: 'Group',
    },
    {
        key: 4,
        // icon: SVG_ri_contacts_line(24, 24),
        icon: <SVG_ri_contacts_line width={24} height={24} />,
        label: 'Contacts',
    },
    // {
    //     key: 5,
    //     // icon: SVG_ri_settings_3_line(24, 24),
    //     icon: <SVG_ri_settings_3_line width={24} height={24} />,
    //     label: 'Setting',
    // },
];

export default function Tabside() {
    const [arrow] = useState('Show');

    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }

        if (arrow === 'Show') {
            return true;
        }

        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const tabSelec = useSelector((state) => state.tab.tab);
    const dispatch = useDispatch();

    return (
        <div className="flex lg:flex-col flex-row">
            {arrTabs.map((tab) => (
                <Tooltip
                    key={tab.key}
                    placement="top"
                    title={tab.label}
                    arrow={mergedArrow}
                    color="#7a7f9a"
                    mouseLeaveDelay={0}
                >
                    <div
                        onClick={() => {
                            dispatch(setTab(tab.label));
                        }}
                        className={`p-4 lg:mb-2 cursor-pointer ${
                            tab.label === tabSelec
                                ? 'text-current-color bg-third-color rounded-md'
                                : 'text-secondary-color'
                        } `}
                    >
                        {tab.icon}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}
