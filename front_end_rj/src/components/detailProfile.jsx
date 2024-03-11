/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import { Collapse, Divider, Popconfirm, Tooltip, message } from 'antd';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInfo, setOpenProfile } from '~/app/features/roomSlice';
import {
    SVG_cancel,
    SVG_exit_line_duotone,
    SVG_ri_close,
    SVG_ri_edit_2_line,
    SVG_ri_group_line,
    SVG_ri_image_edit_fill,
    SVG_ri_save_line,
    SVG_ri_user_add_line,
} from '~/assets/SVG';

export function ImageConvertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
function ListUser({ users, user, socketRef, friends, dispatch, accessToken }) {
    const handleClick = (item) => {
        const users = [user._id, item._id];

        const data = {
            users,
            userCreate: user._id,
            id: user._id,
            accessToken: accessToken,
        };

        socketRef.current?.emit('add-room', data);
        dispatch(setOpenProfile(false));
    };

    const handleAddFriend = (id) => {
        socketRef.current?.emit('add-friend', {
            id_user: user._id,
            id_friend: id,
            id: user._id,
            accessToken: accessToken,
        });

        message.success('Friend request sent');
    };
    return (
        <div className="flex justify-between flex-col container">
            {users?.map((item, index) => (
                <div key={index} className="cursor-pointer flex items-center mb-2 relative">
                    <div
                        className="flex flex-1 items-center"
                        onClick={() => {
                            if (item?._id !== user._id) {
                                handleClick(item);
                            }
                        }}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current-color-hover text-current-color ">
                            {item?.username[0]}
                        </div>
                        <p className="text-sm font-medium text-gray-900 ml-3 line-clamp-1">{item?.username}</p>
                        {item?.online && (
                            <span className="bottom-0 left-6 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    {item?._id !== user._id ? (
                        friends?.find((friend) => {
                            if (friend.status === 'friend') return friend._id === item?._id;
                        }) ? (
                            ''
                        ) : (
                            <div className="absolute right-0 top-0 mr-2">
                                <Tooltip placement="bottom" title="Add friend" color="#7a7f9a" mouseLeaveDelay={0}>
                                    <button
                                        className="flex items-center justify-center h-8 w-8 rounded-full bg-current-color-hover text-current-color"
                                        onClick={() => handleAddFriend(item?._id)}
                                    >
                                        <SVG_ri_user_add_line height={16} width={16} />
                                    </button>
                                </Tooltip>
                            </div>
                        )
                    ) : (
                        ''
                    )}
                </div>
            ))}
        </div>
    );
}

export function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const MAX_WIDTH = 800;
            const scaleFactor = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, file.type);
        };
        img.onerror = reject;
    });
}

function DetailProfile({ infoRoom, socketRef, user, userIsFriend }) {
    const [imageChange, setImageChange] = React.useState(null);
    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.user.accessToken);
    const friends = useSelector((state) => state.user.listFriend);

    const handleEditRoom = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const { name } = Object.fromEntries(data.entries());

        if (!name && !imageChange) {
            return message.warning('You have not changed anything');
        }
        if (imageChange) {
            const imageResize = await resizeImage(imageChange);

            const imageBase64 = await ImageConvertBase64(imageResize);

            socketRef.current.emit('edit-room', {
                id_room: infoRoom._id,
                name,
                image: imageBase64,
                id: user._id,
                accessToken: accessToken,
            });
        } else {
            socketRef.current.emit('edit-room', {
                id_room: infoRoom._id,
                name,
                id: user._id,
                accessToken: accessToken,
            });
        }

        setImageChange(null);
        e.target.reset();
    };

    const items = [
        {
            key: '1',
            label: (
                <div className="flex items-center w-full">
                    <SVG_ri_group_line height={16} width={16} />
                    <span className="ml-3">Members</span>
                </div>
            ),
            children: (
                <div className="flex flex-col">
                    <ListUser
                        users={infoRoom?.users}
                        user={user}
                        socketRef={socketRef}
                        friends={friends}
                        dispatch={dispatch}
                        accessToken={accessToken}
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div className="flex items-center w-full">
                    <SVG_ri_edit_2_line height={16} width={16} />
                    <span className="ml-3">Edit</span>
                </div>
            ),

            children: (
                <form className="flex flex-col" onSubmit={handleEditRoom}>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name..."
                            className="flex-1 px-4 py-2 text-sm text-gray-600 bg-fourth-color rounded-lg focus:outline-none focus:border-transparent w-full"
                            name="name"
                            autoComplete="off"
                            defaultValue={infoRoom?.name}
                        />
                    </div>

                    <div className="flex flex-col mt-4 line-clamp-1">
                        <label className="text-sm font-medium text-gray-900">Image</label>
                        <input
                            type="file"
                            className="hidden"
                            name="image"
                            id="name"
                            autoComplete="off"
                            onChange={(e) => {
                                setImageChange(e.target.files[0]);
                            }}
                        />
                        <label
                            htmlFor="name"
                            className="flex items-center justify-center w-10 aspect-square mt-2 cursor-pointer p-2 bg-current-color text-white rounded-md"
                        >
                            <SVG_ri_image_edit_fill height={16} width={16} />
                        </label>

                        {imageChange && (
                            <img
                                className="w-16 h-16 rounded-md mt-2"
                                src={URL.createObjectURL(imageChange)}
                                alt="Rounded avatar"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="flex items-center justify-center h-10 w-12 mt-4 cursor-pointer p-2 bg-current-color text-white rounded-md"
                    >
                        <span>Save</span>
                    </button>
                </form>
            ),
        },
    ];

    const confirm = (e) => {
        socketRef.current?.emit('leave-room', {
            id_room: infoRoom._id,
            id_user: user._id,
            id: user._id,
            accessToken: accessToken,
        });
    };

    const [openChangeNickname, setOpenChangeNickname] = React.useState(false);
    const [nickname, setNickname] = React.useState(userIsFriend?.nickname || userIsFriend?.username);

    const handleChangeNickname = () => {
        socketRef.current?.emit('set-nickname', {
            id_room: infoRoom._id,
            id_user: userIsFriend._id,
            nickname: nickname || userIsFriend?.username,
            id: user._id,
            accessToken: accessToken,
        });

        dispatch(
            setInfo({
                ...infoRoom,
                users: infoRoom.users.map((user_) =>
                    user_._id === userIsFriend._id ? { ...user_, nickname: nickname || userIsFriend?.username } : user_,
                ),
            }),
        );

        setOpenChangeNickname(false);

        message.success('Change nickname successfully');
    };
    return (
        <div className="flex flex-1 flex-col bg-white shadow-md px-4 py-10 md:relative fixed top-0 right-0 h-full w-full lg:w-1/3 z-50">
            <div
                className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer"
                onClick={() => dispatch(setOpenProfile(false))}
            >
                <SVG_ri_close height={20} width={20} fill="#7a7f9a" />
            </div>

            <div className="flex flex-col items-center justify-center w-full">
                {infoRoom?.isGroupChat ? (
                    <>
                        {infoRoom?.image ? (
                            <img className="w-32 h-32 rounded-full" src={infoRoom?.image} alt="" />
                        ) : (
                            <div className="w-32 h-32  rounded-full bg-current-color-hover text-current-color flex items-center justify-center ">
                                {infoRoom?.name[0]}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="w-32 h-32  rounded-full bg-current-color-hover text-current-color flex items-center justify-center ">
                            {userIsFriend?.username[0]}
                        </div>
                    </>
                )}
                <div className="flex items-center justify-center mt-4">
                    {openChangeNickname ? (
                        <input
                            type="text"
                            placeholder="Enter your name..."
                            className="flex-1 px-4 py-2 text-sm text-gray-600 bg-fourth-color rounded-lg focus:outline-none focus:border-transparent w-full"
                            name="name"
                            autoComplete="off"
                            defaultValue={userIsFriend?.nickname || userIsFriend?.username || nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    ) : (
                        <p className="text-base font-semibold text-gray-900">
                            {infoRoom?.name || userIsFriend?.nickname || userIsFriend?.username}
                        </p>
                    )}
                    {!infoRoom?.isGroupChat ? (
                        !openChangeNickname ? (
                            <div className="ml-2 cursor-pointer" onClick={() => setOpenChangeNickname(true)}>
                                <SVG_ri_edit_2_line height={16} width={16} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="ml-2 cursor-pointer" onClick={handleChangeNickname}>
                                    <SVG_ri_save_line height={16} width={16} />
                                </div>
                                <div
                                    className="ml-2 cursor-pointer"
                                    onClick={() => {
                                        setOpenChangeNickname(false);
                                    }}
                                >
                                    <SVG_cancel height={16} width={16} />
                                </div>
                            </div>
                        )
                    ) : (
                        ''
                    )}
                </div>
                <p className="text-xs font-medium text-gray-500">
                    {infoRoom?.isGroupChat ? 'Group Chat' : 'Private Chat'}
                </p>

                <Popconfirm
                    title="Are you sure to leave this room?"
                    description="You will not be able to recover this imaginary file!"
                    onConfirm={confirm}
                    okText="Yes"
                    okType="danger"
                    cancelText="No"
                >
                    <Tooltip placement="bottom" title="Leave" color="#7a7f9a" mouseLeaveDelay={0}>
                        <button className="mx-3 flex items-center justify-center h-10 w-10 mt-4 rounded-full bg-current-color-hover text-current-color">
                            <SVG_exit_line_duotone height={20} width={20} />
                        </button>
                    </Tooltip>
                </Popconfirm>
            </div>

            <Divider className="lg:my-4" />

            <div className="flex flex-col flex-1 overflow-y-auto">
                <Collapse
                    accordion
                    items={infoRoom?.isGroupChat ? items : items.slice(0, 1)}
                    defaultActiveKey={['1']}
                    expandIconPosition={'end'}
                />
            </div>
        </div>
    );
}

export default DetailProfile;
