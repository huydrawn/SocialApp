import { createSlice, removeListener } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeToken, saveToken } from "../service/JwtTokenService";
import { setUser } from "./userSlice";

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      saveToken(action.payload.accessToken);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      removeToken();
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
