import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '../../utils/authorizeAxios';
import { API_ROOT_URL } from '../../utils/constants';

//Initializing the value of a Slice in redux
const initialState = {
  currentNotifications: null
}

// Actions that call api (asynchronous) and update data into Redux, use the createAsyncThunk Middleware that comes with extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT_URL}/v1/invitations`)
    // Note: axios will return the result via its property data
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

// Initialize a slice in the redux store
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  // Reducers: Where data is processed synchronously
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    // Add a new notification record to the top of the currentNotifications array
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift is to add an element to the beginning of the array, the opposite of push
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  // ExtraReducers: Asynchronous data processing
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // This snippet reverses the received invitations array, simply to display the newest one at the top.
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      // Update boardInvitation data (inside it will have new Status after update)
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

// Action creators are generated for each case reducer function
// Actions: It is the place for the components below to call dispatch() to it to update data through the reducer (run synchronously)
// Notice above that the actions properties are not visible anywhere, because these actions are simply automatically created by redux based on the reducer name.
export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

// Selectors: This is the place for the components below to call the useSelector() hook to get data from the redux store for use.
export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

// his file is called notificationsSlice BUT we will export something called Reducer
// export default notificationsSlice.reducer
export const notificationsReducer = notificationsSlice.reducer
