/* eslint-disable react/jsx-pascal-case */
import { Divider, Dropdown, message } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '~/app/features/userSlice';
import { SVG_ri_more_2_fill, SVG_ri_record_circle_fill } from '~/assets/SVG';
import { useSocket } from '~/services/connectSocket';

function checkPhone(phone) {
    const re = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    return re.test(phone);
}

function Profile() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const socketRef = useSocket();

    const [change, setChange] = React.useState(false);

    const items = [
        {
            label: (
                <div
                    onClick={() => {
                        setChange(true);
                    }}
                    className="text-sm text-secondary-color font-medium py-2 px-4"
                >
                    Edit Profile
                </div>
            ),
            key: '0',
        },
    ];

    const handleChangeProfile = (e) => {
        e.preventDefault();

        const { phone, address } = e.target;

        if (phone.value && !checkPhone(phone.value)) {
            message.error('Phone number is invalid');
            return;
        }
        const data = {
            id: user._id,
            phone: phone.value,
            address: address.value,
        };

        socketRef?.current?.emit('change-profile', data);
        setChange(false);

        socketRef?.current?.on('receive-change-profile', (data) => {
            dispatch(setUser(data));
        });

        e.target.reset();
    };
    return (
        <>
            <div className="flex py-2 px-4 items-center justify-between">
                <span className="text-xl text-black font-semibold">Profile</span>
                <div className="flex items-center">
                    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                        <button className="flex items-center justify-center w-12 h-8">
                            <SVG_ri_more_2_fill width={18} height={18} />
                        </button>
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-center justify-center flex-col">
                <div className="py-6">
                    {user?.image ? (
                        <img className="w-20 h-20 rounded-full" src={user?.image} alt="" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                            {user?.username[0]}
                        </div>
                    )}
                </div>

                <span className="text-lg text-black font-medium">{user?.username}</span>
                <div className="flex items-center">
                    <SVG_ri_record_circle_fill width={10} height={10} fill="#06d6a0" />
                    <span className="text-sm text-secondary-color font-medium ml-2">Online</span>
                </div>
            </div>

            <Divider className="my-8" />
            <div className="flex flex-col p-4">
                <span className="text-lg text-black font-semibold underline">About</span>

                <form className="flex flex-col mt-4" onSubmit={handleChangeProfile}>
                    <span className="text-sm text-secondary-color font-medium underline">Email:</span>
                    <span className="text-sm text-black font-medium">{user?.email}</span>

                    <span className="text-sm text-secondary-color font-medium mt-4 underline">Phone:</span>
                    {change ? (
                        <input
                            className="text-sm text-black font-medium outline-none py-2 px-4"
                            defaultValue={user?.phone}
                            type="text"
                            placeholder="Enter your phone"
                            name="phone"
                            autoComplete="off"
                        />
                    ) : (
                        <span className="text-sm text-black font-medium">
                            {user?.phone || 'Phone number not found'}
                        </span>
                    )}

                    <span className="text-sm text-secondary-color font-medium mt-4 underline">Address:</span>
                    {change ? (
                        <input
                            className="text-sm text-black font-medium outline-none py-2 px-4"
                            defaultValue={user?.address}
                            type="text"
                            placeholder="Enter your address"
                            name="address"
                            autoComplete="off"
                        />
                    ) : (
                        <span className="text-sm text-black font-medium">{user?.address || 'Address not found'}</span>
                    )}

                    <span className="text-sm text-secondary-color font-medium mt-4 underline">Time create:</span>
                    <span className="text-sm text-black font-medium">
                        {new Date(user?.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        }) || 'Time not found'}
                    </span>

                    {change ? (
                        <div className="flex items-center justify-evenly">
                            <button
                                className="text-sm text-white font-medium  px-4 py-2 mt-4 rounded-md bg-current-color hover:bg-current-color-hover-2 transition-all duration-300 ease-in-out"
                                type="submit"
                            >
                                Save
                            </button>

                            <button
                                className="text-sm text-white font-medium px-4 py-2 mt-4 rounded-md bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in-out"
                                type="button"
                                onClick={() => setChange(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : null}
                </form>
            </div>
        </>
    );
}

export default Profile;
