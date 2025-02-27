import authorizedAxiosInstance from '../utils/authorizeAxios';
import { API_ROOT_URL } from '../utils/constants';
import { toast } from 'react-toastify';

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/boards/${boardId}`, updateData);
  return response.data; 
}

export const moveCardInDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/boards/supports/moving_card`, updateData);
  return response.data; 
}


export const createNewColumnAPI = async (column) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT_URL}/v1/columns`, column);
  console.log(response.data);
  return response.data; // This is the newly created column
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/columns/${columnId}`, updateData);
  return response.data; 
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT_URL}/v1/columns/${columnId}`);
  return response.data; 
}

export const createNewCardAPI = async (card) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT_URL}/v1/cards`, card);
  console.log(response.data);
  return response.data; // This is the newly created card
}


/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT_URL}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT_URL}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT_URL}/v1/users/refresh_token`)
  return response.data
}