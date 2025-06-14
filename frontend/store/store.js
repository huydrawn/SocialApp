import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '../slice/navigationSlice'
import authReducer from '../slice/authSlice'
import  userReducer  from '../slice/userSlice'

// Đảm bảo reducer được khai báo dưới dạng một object
const store = configureStore({
  reducer: {
    navigation: navigationReducer, // 'navigation' phải là key hợp lệ
    auth:authReducer,
    user:userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Tắt serializableCheck để tránh cảnh báo
    }),
})

export default store