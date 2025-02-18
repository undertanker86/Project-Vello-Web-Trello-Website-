import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Confirm Dialog
import { ConfirmProvider } from "material-ui-confirm";

// Redux Store
import { Provider } from 'react-redux'
import {store} from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <CssVarsProvider  theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogProps: {maxWidth: 'xs'}
        }}>
          <CssBaseline />
          <App />
          <ToastContainer theme="colored" position="bottom-left"/>
        </ConfirmProvider>
      </CssVarsProvider >
    </Provider>
  </>
)
