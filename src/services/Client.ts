import {API_KEY} from '@env';
import axios from 'axios';
import ApiConfig from './ApiConfig';

const apiClient = axios.create({
  baseURL: ApiConfig.BASE_URL,
  timeout: 30000,
  maxRedirects: 0,
  headers: {
    'Content-Type': 'application/json',
    'x-mediamagic-key': API_KEY,
  },
});

export default apiClient;
