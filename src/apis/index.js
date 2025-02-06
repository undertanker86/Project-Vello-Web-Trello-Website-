import axios from 'axios';
import { API_ROOT_URL } from '../utils/constants';
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT_URL}/v1/boards/${boardId}`);
  console.log(response.data);
  return response.data; // This is the board details
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT_URL}/v1/boards/${boardId}`, updateData);
  return response.data; 
}

export const moveCardInDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT_URL}/v1/boards/supports/moving_card`, updateData);
  return response.data; 
}


export const createNewColumnAPI = async (column) => {
  const response = await axios.post(`${API_ROOT_URL}/v1/columns`, column);
  console.log(response.data);
  return response.data; // This is the newly created column
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT_URL}/v1/columns/${columnId}`, updateData);
  return response.data; 
}

export const createNewCardAPI = async (card) => {
  const response = await axios.post(`${API_ROOT_URL}/v1/cards`, card);
  console.log(response.data);
  return response.data; // This is the newly created card
}