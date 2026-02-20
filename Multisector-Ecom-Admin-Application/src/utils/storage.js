import { STORAGE_KEYS } from '../config/constants';


export const setStoredAuth = (authData) => {
  const { accessToken, refreshToken, email, name, role, userId, expiresIn } = authData;
  
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, expiresIn.toString());
  
  const userData = { email, name, role, userId };
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', email);
};
export const getStoredTokens = () => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  
  if (!accessToken || !refreshToken) {
    return null;
  }
  
  return { accessToken, refreshToken };
};
export const getStoredUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};
export const isAuthenticated = () => {
  const tokens = getStoredTokens();
  return !!tokens; 
};
export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
};
export const setRememberMe = (email, remember) => {
  if (remember && email) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
  }
};
export const getRememberMe = () => {
  const remember = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  const savedEmail = localStorage.getItem(STORAGE_KEYS.SAVED_EMAIL) || '';
  return { remember, savedEmail };
};