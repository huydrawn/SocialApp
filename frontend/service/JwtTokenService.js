import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu token
export const saveToken = async (accessToken, refreshToken = null) => {
  try {
    await AsyncStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('refresh_token', refreshToken);
    }
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
};

// Lấy token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

// Lấy refresh token
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refresh_token');
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

// Xóa token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Failed to remove tokens:', error);
  }
};

