import { createSlice } from '@reduxjs/toolkit'

// Initializing the value of a Slice in redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

// Initialize a slice in the redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducers: Where data is processed synchronously
  reducers: {
    // Note that here we need curly brackets for the function in the reducer even though the code inside is only 1 line, this is a rule of Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    // Clear data and close ActiveCard modal
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload 
      // Handle data received from action
      //...
      // Update currentActiveCard data in Redux
      state.currentActiveCard = fullCard
    }
  },
  // ExtraReducers: Asynchronous data processing
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

// Action creators are generated for each case reducer function
// Actions: It is the place for the components below to call dispatch() to it to update data through the reducer (run synchronously)
// Notice above that there is no properties actions, because these actions are simply automatically created by redux according to the reducer name.
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

// Selectors: This is the place for the components below to call the useSelector() hook to get data from the redux store for use.
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

// This file is called activeCardSlice BUT we will export something called Reducer,
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer
