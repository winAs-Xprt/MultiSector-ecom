export const API_BASE_URL = 'https://inibuy.iniserve.com';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  SEND_OTP: '/auth/login/otp/send',
  LOGOUT: '/auth/logout',
};


export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  EXPIRES_IN: 'expiresIn',
  REMEMBER_ME: 'rememberMe',
  SAVED_EMAIL: 'savedEmail',
};

export const OTP_LENGTH = 6;