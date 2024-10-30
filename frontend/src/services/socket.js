import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

export const subscribeToScores = (callback) => {
  socket.on('scoreUpdate', callback);
};

export const unsubscribeFromScores = (callback) => {
  socket.off('scoreUpdate', callback);
};