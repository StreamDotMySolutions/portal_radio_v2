import axios from 'axios';
import { startLoading, stopLoading } from './loadingBar';

axios.interceptors.request.use(
    (config) => {
        startLoading();
        return config;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        stopLoading();
        return response;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);
