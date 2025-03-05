import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '../../utils/authorizeAxios';
import { API_ROOT_URL } from '../../utils/constants';
import { toast } from 'react-toastify';

// Initial value State of Slice in Redux

const initialState = {
  currentUser: null
}

// Call API not async and update data to Redux, using middleware createAsyncThunk with extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT_URL}/v1/users/login`, data);
    return response.data;
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT_URL}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/users/update`, data)
    return response.data
  }
)


// Initialize Slice in Redux Store

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers are functions that define how to update the state when an action is dispatched (sync data)
  reducers: {},
  // ExtraReducers are functions that define how to update the state when an action is dispatched (async data)
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        const user = action.payload
        // action.payload is the data returned from the API  == response.data
        state.currentUser = user
      })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
        /**
         * API logout after calling successfully will clear the currentUser information to null here
         * Combine with ProtectedRoute already done in App.js => the code will standardize to the Login page
         */
        state.currentUser = null
      })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})
// Action: where for components to dispatch actions to update the state 
// export const {} = userSlice.actions

// Selectors: where for components to get data from the state
export const selectCurrentUser = (state) => state.user.currentUser

export const userReducer = userSlice.reducer