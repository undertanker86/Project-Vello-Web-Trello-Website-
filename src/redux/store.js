import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice' // Import Slice to Store
import { userReducer } from './user/userSlice' // Import Slice to Store



// Config redux-persist
import { combineReducers } from 'redux' // note that we already have redux in node_modules because when installing @reduxjs/toolkit it already exists
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activeCardReducer } from './activeCard/activeCardSlice'


const rootPersistConfig = {
  key: 'root', // key of the persist we specify, just keep the default as root
  storage: storage, // storage variable above - save to localstorage
  whitelist: ['user'] // define the slices of data ALLOWED to persist through each browser refresh
}

// Combine the reducers in our project here
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)


export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error when implement redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})