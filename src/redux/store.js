import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice' // Import Slice to Store

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer, // Add Slice to Store
  },
})