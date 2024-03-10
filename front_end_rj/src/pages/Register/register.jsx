/* eslint-disable react/jsx-pascal-case */
import { message, notification } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '~/App';
import {
    SGVLogo,
    SVG_eye_slash_thin,
    SVG_eye_thin,
    SVG_ri_lock_2_line,
    SVG_ri_mail_line,
    SVG_user_2_line,
} from '~/assets/SVG';

function Register() {
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.email || !data.password || !data.confirmPassword) {
            message.error('Please fill in all fields');
            return;
        }

        if (data.password !== data.confirmPassword) {
            message.error('Passwords do not match');
            return;
        }

        const res = await fetch(`${url}api/v1/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                username: data.username,
            }),
        });

        const json = await res.json();

        if (res.status !== 200) {
            message.error(json.message);
            return;
        }

        notification.success({
            message: 'Account created',
            description: 'Your account has been created',
            placement: 'topRight',
            duration: 5,
        });

        navigate('/login', { replace: true });
        localStorage.removeItem('remember');
    };
    return (
        <div className="flex items-center flex-col justify-center min-h-screen bg-primary-color">
            <div className="flex flex-col items-center mb-4">
                <div className="flex items-center mb-16">
                    <SGVLogo width={28} height={28} />
                    <span className="ml-2 text-xl font-semibold">HCode Chat</span>
                </div>
                <div className="flex text-center flex-col">
                    <span className="text-xl font-medium">Register</span>
                    <span className="text-secondary-color">Register to access your account</span>
                </div>
            </div>

            <div className="p-4 bg-white shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col p-3">
                    <label className="mb-2 text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center justify-center w-full md:w-[500px]">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            <SVG_ri_mail_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border  outline-none text-secondary-color focus:border-primary-color"
                            type="email"
                            placeholder="Email"
                            name="email"
                        />
                    </div>

                    <label className="mb-2 mt-4 text-sm font-medium text-gray-700">Username</label>
                    <div className="flex items-center justify-center w-full md:w-[500px]">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            <SVG_user_2_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border outline-none text-secondary-color focus:border-primary-color"
                            type="text"
                            placeholder="Username"
                            name="username"
                        />
                    </div>

                    <label className="mb-2 mt-4 text-sm font-medium text-gray-700">Password</label>
                    <div className="flex items-center justify-center">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            <SVG_ri_lock_2_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border outline-none text-secondary-color focus:border-primary-color"
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                        />
                        <div
                            className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                <SVG_eye_slash_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            ) : (
                                <SVG_eye_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            )}
                        </div>
                    </div>

                    <label className="mb-2 mt-4 text-sm font-medium text-gray-700">Confirm Password</label>

                    <div className="flex items-center justify-center">
                        <div className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1">
                            <SVG_ri_lock_2_line width={20} height={20} color={'rgba(156,163,175,1)'} />
                        </div>
                        <input
                            className="w-full px-4 py-3 text-sm border outline-none text-secondary-color focus:border-primary-color"
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            name="confirmPassword"
                        />
                        <div
                            className="p-3 bg-secondary-color bg-opacity-10 border border-spacing-1 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? (
                                <SVG_eye_slash_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            ) : (
                                <SVG_eye_thin width={20} height={20} color={'rgba(156,163,175,1)'} />
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 text-sm font-medium text-white bg-current-color rounded-sm"
                    >
                        Register
                    </button>
                </form>
            </div>

            <div className="flex items-center justify-center mt-6">
                <span className="text-base font-medium text-gray-700">Already have an account?</span>
                <Link to={'/login'} className="ml-2 text-base font-medium text-current-color cursor-pointer">
                    Sign in
                </Link>
            </div>
        </div>
    );
}

export default Register;
