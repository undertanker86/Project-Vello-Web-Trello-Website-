import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '../../utils/generate'
import authorizedAxiosInstance from '../../utils/authorizeAxios';
import { API_ROOT_URL } from '../../utils/constants';
import { mapOrder } from '../../utils/sortarraybasearray';

// Initial value State of Slice in Redux

const initialState = {
  currentActiveBoard: null
}

// Call API not async and update data to Redux, using middleware createAsyncThunk with extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT_URL}/v1/boards/${boardId}`);
    return response.data;
  }
)



// Initialize Slice in Redux Store

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers are functions that define how to update the state when an action is dispatched (sync data)
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload // Stardardize name to received data to Reducer, here need assign to fullBoard
      // Handle data received from action


      // Update State
      state.currentActiveBoard = board
    
    },
    updateCardInBoard: (state, action) =>{
      // Update Nested Data
      const incomingCard = action.payload
      // Find Board -> Column -> Card
      const column = state.currentActiveBoard.columns.find(column => column._id === incomingCard.columnId)
      // Check if the card already exists
      if(column){
        const card = column.cards.find(card => card._id === incomingCard._id)
        if(card){
          // Object.keys to get all properties (keys) of incomingCard to a Array, so forEach. 
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  // ExtraReducers are functions that define how to update the state when an action is dispatched (async data)
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        let board = action.payload

        // members in boards will to group by 2 array owners and members
        board.FE_allUsers = board.owners.concat(board.members)
        // Remove duplicate users
        board.FE_allUsers = board.FE_allUsers.filter((user, index, self) =>
          index === self.findIndex((t) => (
            t._id === user._id
          ))
        )
        // Handle data received from action
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          // Handle empty column
          if(isEmpty(column.cards)){
            column.cards.push(generatePlaceHolderCard(column))
            column.cardOrderIds.push(generatePlaceHolderCard(column)._id)
          }
          else{
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        // action.payload is the data returned from the API  == response.data
        state.currentActiveBoard = board
      })
  }
})
// Action: where for components to dispatch actions to update the state 
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

// Selectors: where for components to get data from the state
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard

export const activeBoardReducer = activeBoardSlice.reducer