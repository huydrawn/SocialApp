import { createSlice, removeListener } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  chatFriend: {},
  profile:{}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setChatFriend: (state, action) => {
      state.chatFriend = action.payload;
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload; // Cập nhật avatar
      }
    },
    updateProfile: (state, action) => {
      const { name, birth } = action.payload;
      
      // Ensure that state.profile is initialized as an object
      if (state.profile) {
        // Update name if provided
        if (name) state.profile.name = name;
        
        // Update birth if provided, and convert from Long timestamp to Date
        if (birth) state.profile.birth = birth;
      } else {
        // If state.profile is undefined, initialize it
        state.profile = { 
          name: name || '', 
          birth: birth || null 
        };
      }
    },
  },
});

export const { setUser, setChatFriend,updateAvatar,setProfile,updateProfile} = userSlice.actions;
export const userIf = (state) => state.user.user;
export const getProfile = (state) => state.user.profile;
export const chatFriend = (state) => state.user.chatFriend;
export default userSlice.reducer;
