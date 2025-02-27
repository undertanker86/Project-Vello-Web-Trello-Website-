import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from "../apis";
import { logoutUserAPI } from '../redux/user/userSlice'

// Inject store: when need to use redux store in non-component files like this file
// Understand simply: when the application starts up, the code will run into the main.jsx first, from there we call the injectStore function immediately to assign the mainStore variable to the axiosReduxStore variable locally in this file.
let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

// Init axios instance for custom and config to suitable project
let authorizedAxiosInstance = axios.create()

// Config wait tine for 1 request: 5 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 5

// withCredentials: true to allow cookie in request

authorizedAxiosInstance.defaults.withCredentials = true

// Config Interceptor to handle error (That like middleware when call API)

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // Using css pointer-event to block user interaction while waiting for API response
  interceptorLoadingElements(true)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});



// Init promise for call refresh token api
// Pupose create Promise when call api refresh token to done, so retry many again api error before.
let refreshTokenPromise = null
// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

    // Using css pointer-event to block user interaction while waiting for API response
    interceptorLoadingElements(false)
  return response;
}, function (error) {

  // Using css pointer-event to block user interaction while waiting for API response
  interceptorLoadingElements(false)

  // Handle Refresh Token Automatically
  // Check if error response is 401 - Unauthorized - call logout api
  if(error.response?.status === 401){
    axiosReduxStore.dispatch(logoutUserAPI(false)) // false: not show success message when logout
  }
  // Check if error response is 410 - GONE - call refresh token api
  const originalRequests = error.config // only focus requestURL
  if(error.response?.status === 410 && !originalRequests._retry){ // _retry: === true 
    originalRequests._retry = true

    // Call refresh token api
    if(!refreshTokenPromise){
      refreshTokenPromise = refreshTokenAPI()
      .then(data =>{
        // accessToken is already in httpOnly cookie
        return data?.accessToken
      })
      .catch((_error) =>{
        // Call logout api if refresh token fail
        axiosReduxStore.dispatch(logoutUserAPI(false))
        // Avoid case call 2 logout api if API refresh token fail
        return Promise.reject(_error)
      })
      .finally(() =>{
        // final will assign null to refreshTokenPromise
        refreshTokenPromise = null
      })
    }

    // Return promise to retry api after refresh token
    return refreshTokenPromise.then( accessToken =>{
      // Case01: for case project need save accessToken to localstorage or somewhere so write code here - not need because accessToken save in cookie when call api refreshToken success

      // S02: Return axios instance of them to combine with originalRequests to call before apis error
    return authorizedAxiosInstance(originalRequests) // call requestURL (API) error before
    })



  }




  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Handle all response error here
  // console.log("Error from response interceptor: ", error)
  let errorMessage = error?.message
  if(error.response?.data?.message){
    errorMessage = error.response.data.message
  }
  // Notify errors to user (Reject 410 - GONE - service auto refresh token)
  if(error.response?.status !== 410){
    toast.error(errorMessage)
  }
  return Promise.reject(error);
});

export default authorizedAxiosInstance