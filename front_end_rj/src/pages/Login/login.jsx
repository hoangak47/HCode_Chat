/* eslint-disable react/jsx-pascal-case */
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '~/App';
import { setAccessToken, setListFriend, setUser } from '~/app/features/userSlice';
import { SGVLogo, SVG_eye_slash_thin, SVG_eye_thin, SVG_ri_lock_2_line, SVG_ri_mail_line } from '~/assets/SVG';

export async function getListsFriend(accessToken, user, dispatch) {
    try {
        const res = await axios.get(`${url}api/v1/auth/friends`, {
            headers: {
                'x-access-token': accessToken,
                id: user._id,
            },
        });

        dispatch(setListFriend(res?.data?.friendsList));
    } catch (error) {
        console.log(error);
    }
}

function Login() {
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const user = useSelector((state) => state.user.user);

    React.useEffect(() => {
        if (Object.keys(user).length > 0) {
            navigate('/', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.email || !data.password) {
            message.error('Please fill in all fields');
            return;
        }

        const res = await fetch(`${url}api/v1/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        const json = await res.json();

        if (res.status !== 200) {
            message.error(json.message);
            return;
        }

        if (data.remember === 'on') {
            localStorage.setItem(
                'remember',
                JSON.stringify({
                    email: data.email,
                    password: data.password,
                    remember: true,
                }),
            );
        } else {
            localStorage.removeItem('remember');
        }

        dispatch(setUser(json.user));
        dispatch(setAccessToken(json.accessToken));

        getListsFriend(json.accessToken, json.user, dispatch);

        navigate('/', { replace: true });
    };

    const [remember, setRemember] = React.useState({
        email: '',
        password: '',
        remember: false,
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setRemember(JSON.parse(localStorage.getItem('remember') || '{}'));
        }
    }, []);
    return (
        <div className="flex items-center flex-col justify-center min-h-screen bg-primary-color">
            <div className="flex flex-col items-center mb-4">
                <div className="flex items-center mb-16">
                    {/* {SGVLogo(28, 28)} */}
                    <SGVLogo width={28} height={28} />
                    <span className="ml-2 text-xl font-semibold">HCode Chat</span>
                </div>
                <div className="flex text-center flex-col">
                    <span className="text-xl font-medium">Sign in</span>
                    <span className="text-secondary-color">Sign in to continue to Chatvia.</span>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col p-3">
                    <label className="mb-2 text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center justify-center w-full md:w-[500px]">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            {/* {SVG_ri_mail_line(20, 20, "rgba(156,163,175,1)")} */}
                            <SVG_ri_mail_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border  outline-none text-secondary-color focus:border-primary-color"
                            type="email"
                            placeholder="Email"
                            name="email"
                            defaultValue={remember.email || ''}
                        />
                    </div>
                    <label className="mb-2 mt-4 text-sm font-medium text-gray-700">Password</label>
                    <div className="flex items-center justify-center">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            {/* {SVG_ri_lock_2_line(20, 20, "rgba(156,163,175,1)")} */}
                            <SVG_ri_lock_2_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border outline-none text-secondary-color focus:border-primary-color"
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            defaultValue={remember.password || ''}
                        />
                        <div
                            className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                // ? SVG_eye_slash_thin(20, 20, "rgba(156,163,175,1)")
                                <SVG_eye_slash_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            ) : (
                                // : SVG_eye_thin(20, 20, "rgba(156,163,175,1)")}
                                <SVG_eye_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center justify-center">
                            <input
                                className="w-4 h-4 mr-2 border border-gray-300 rounded-sm"
                                type="checkbox"
                                name="remember"
                                checked={remember?.remember || false}
                                onChange={(e) =>
                                    setRemember({
                                        ...remember,
                                        remember: e?.target?.checked,
                                    })
                                }
                            />
                            <span className="text-sm font-medium text-gray-700">Remember me</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Forgot password?</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 text-sm font-medium text-white bg-current-color rounded-sm"
                    >
                        Sign in
                    </button>
                </form>
            </div>

            <div className="flex items-center justify-center mt-6">
                <span className="text-base font-medium text-gray-700">Don&apos;t have an account?</span>
                <Link to={'/register'} className="ml-2 text-base font-medium text-current-color cursor-pointer">
                    Register
                </Link>
            </div>
        </div>
    );
}

export default Login;
