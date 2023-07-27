import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseURL= 'http://192.168.1.41:8080/api';

const routineApi = axios.create({ baseURL });

routineApi.interceptors.request.use(
    async(config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
      }
)


export default routineApi;