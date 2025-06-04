import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://user-auth-server-theta.vercel.app',
    withCredentials: true,
});

const useAxiosSecure = () => {
    return axiosInstance;
};

export default useAxiosSecure;
