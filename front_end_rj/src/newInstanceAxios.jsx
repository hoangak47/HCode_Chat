import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setAccessToken } from './app/features/userSlice';
import { url } from './App';

const refreshToken = async (id) => {
    try {
        const data = await axios.get(`${url}api/v1/auth/refresh-token?id=${id}`, {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        // console.log(error);
    }
};

export default function newInstanceAxios(accessToken, dispatch) {
    const newInstant = axios.create();

    newInstant.interceptors.request.use(
        async (config) => {
            let date = new Date();

            const decoded = jwtDecode(accessToken);
            if (decoded.exp < date.getTime() / 1000) {
                const data = await refreshToken(decoded.id);
                dispatch(setAccessToken(data.data.accessToken));
            }

            return config;
        },
        (error) => {
            return;
        },
    );

    return newInstant;
}
