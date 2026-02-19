import axios from 'axios';
import { getStoredTokens, clearStoredAuth } from '../utils/storage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
   
    if (error.response?.status === 401) {
      
      clearStoredAuth();
      
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export const authAPI = {
  
  loginWithPassword: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
 sendOTP: async (email) => {
    try {
      const response = await api.post(API_ENDPOINTS.SEND_OTP, { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, otp });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  logout: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { message: data.message || 'Invalid request', status };
      case 401:
        return { message: 'Invalid email or password', status };
      case 403:
        return { message: 'Access forbidden', status };
      case 404:
        return { message: 
'API endpoint not found', status };
      case 500:
        return { message: 'Server error. Please try again later.', status };
      default:
        return { message: data.message || 'An error occurred', status };
    }
  } else if (error.request) {
    return { message: 'Network error. Please check your connection.', status: 0 };
  } else {
    return { message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

export default api;