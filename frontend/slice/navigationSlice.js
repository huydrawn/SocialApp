import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  currentNav: "Home",
  isVisibale:true,
  scrollY:null
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrent: (state , action) => {
      state.currentNav = action.payload
    },
    setVisiable : (state , action) => {
      state.isVisibale = action.payload
    },
    setScrollY:(state , action) => {
      state.scrollY = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCurrent , setVisiable ,setScrollY} = navigationSlice.actions
export const selectCurrentNav = (state) => state.navigation.currentNav
export const isVisibale = (state) => state.navigation.isVisibale
export const currentScrollY = (state) => state.navigation.scrollY

export default navigationSlice.reducer