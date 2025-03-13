// Cofig Socket-io (1)
import { io } from 'socket.io-client'
import { API_ROOT_URL } from './utils/constants.js';
export const socketIoInstance = io(API_ROOT_URL)