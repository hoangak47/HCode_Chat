/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-pascal-case */
import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SVG_ri_group_line } from '~/assets/SVG';
import FormSearch from './formSearch';
import { Divider, Form, Modal, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import { setOpen } from '~/app/features/roomSlice';
import { ImageConvertBase64, resizeImage } from './detailProfile';

function Group({ socketRef }) {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);
    const friends = useSelector((state) => state.user.listFriend);
    const accessToken = useSelector((state) => state.user.accessToken);

    const listMessage = useSelector((state) => state.room.room);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (e) => {
        e.preventDefault();

        form.validateFields()
            .then((values) => {
                const image = imageGroup || '';
                const users = [...values.users, user._id];

                const data = {
                    name: values.name,
                    users,
                    image,
                    userCreate: user._id,
                    isGroupChat: true,
                    id: user._id,
                    accessToken: accessToken,
                };

                socketRef.current?.emit('add-room', data);
                setIsModalOpen(false);
                form.resetFields();
                setImageGroup(null);
            })
            .catch((info) => {
                // console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const [form] = Form.useForm();

    const [imageGroup, setImageGroup] = React.useState(null);

    return (
        <>
            <div className="flex py-2 px-4 items-center justify-between">
                <span className="text-xl text-black font-semibold">Groups</span>
                <div className="flex items-center" onClick={showModal}>
                    <button className="flex items-center justify-center w-12 h-8">
                        <SVG_ri_group_line height={18} width={18} />
                    </button>
                </div>
                <Modal
                    title="Create group"
                    open={isModalOpen}
                    onOk={form.submit}
                    onCancel={handleCancel}
                    footer={[
                        <button
                            key="back"
                            className="px-4 py-2 bg-transparent text-black font-semibold border border-solid border-slate-300 rounded-lg mr-4 hover:bg-slate-300 hover:text-white transition duration-300 ease-in-out"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>,
                        <button
                            key="submit"
                            className="px-4 py-2 bg-current-color text-white font-semibold rounded-lg hover:bg-current-color-hover-2 transition duration-300 ease-in-out"
                            onClick={handleOk}
                        >
                            Create
                        </button>,
                    ]}
                >
                    <Form form={form} layout="vertical" name="form_in_modal" onFinish={handleOk}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the name of group!',
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                className="w-full border border-solid border-slate-300 rounded-lg px-4 py-2"
                            />
                        </Form.Item>
                        <Form.Item
                            name="users"
                            label="Members"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the members of group!',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Please select"
                                className="w-full border border-solid border-slate-300 rounded-lg"
                            >
                                {friends?.map((friend, index) => {
                                    if (friend.status !== 'pending')
                                        return (
                                            <Select.Option key={index} value={friend._id}>
                                                <div className="flex items-center">
                                                    {friend.image ? (
                                                        <img
                                                            className="w-8 h-8 rounded-full"
                                                            src={friend.image}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                                            {friend.username[0]}
                                                        </div>
                                                    )}
                                                    <span className="text-black text-base font-semibold ml-4">
                                                        {friend.username}
                                                    </span>
                                                </div>
                                            </Select.Option>
                                        );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="image" label="Image">
                            <div className="flex items-center">
                                <label
                                    htmlFor="upload-avatar"
                                    className="flex items-center justify-center px-3 py-2 bg-current-color-hover text-current-color cursor-pointer"
                                >
                                    <UploadOutlined />

                                    <span className="ml-2">Upload avatar</span>
                                </label>
                                <input
                                    type="file"
                                    id="upload-avatar"
                                    className="!hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const imageResize = await resizeImage(file);

                                            const imageBase64 = await ImageConvertBase64(imageResize);

                                            setImageGroup(imageBase64);
                                        }
                                    }}
                                />
                                {imageGroup && (
                                    <img
                                        className="w-8 h-8 rounded-full ml-4"
                                        src={imageGroup}
                                        alt=""
                                        onClick={() => {
                                            setImageGroup(null);
                                        }}
                                    />
                                )}
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            <div className="flex flex-col px-4 flex-1 overflow-hidden">
                <FormSearch placeHolder="Search groups" />
                <Divider className="lg:my-4" />

                <div className="flex flex-col mt-4 overflow-y-auto">
                    {listMessage.map((group, index) => {
                        if (group.isGroupChat) {
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center py-2 px-4 mb-4 rounded-sm hover:bg-third-color cursor-pointer ${
                                        params._id === group._id ? 'bg-third-color' : 'bg-transparent'
                                    }`}
                                    onClick={() => {
                                        if (params._id !== group._id) {
                                            navigate(`/${group._id}`);
                                            dispatch(setOpen(true));
                                        }
                                    }}
                                >
                                    {group?.image ? (
                                        <img className="w-8 h-8 rounded-full" src={group.image} alt="" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-current-color-hover text-current-color flex items-center justify-center">
                                            {group.name[0]}
                                        </div>
                                    )}
                                    <span className="text-black text-base font-semibold ml-4">#{group.name}</span>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </>
    );
}

export default Group;
