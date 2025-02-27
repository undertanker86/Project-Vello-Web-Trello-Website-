import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Inject Store to axios
import { injectStore } from './utils/authorizeAxios.js'


// Confirm Dialog
import { ConfirmProvider } from "material-ui-confirm";

// Redux Store
import { Provider } from 'react-redux'
import {store} from './redux/store'

// React Router DOM with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Config Redux Persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistor = persistStore(store)

// Inject Store to axios
injectStore(store)


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <CssVarsProvider  theme={theme}>
            <ConfirmProvider defaultOptions={{
              dialogProps: {maxWidth: 'xs'}
            }}>
              <CssBaseline />
              <App />
              <ToastContainer theme="colored" position="bottom-left"/>
            </ConfirmProvider>
          </CssVarsProvider >
        </PersistGate>
      </Provider>
    </BrowserRouter>
)
