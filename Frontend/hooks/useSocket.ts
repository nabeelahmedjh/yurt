import { useEffect } from 'react';
import socketService from '../services/socket';

const useSocket = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    const socket = socketService.connect();

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
      socketService.disconnect();
    };
  }, [event, callback]);

  const emitEvent = (event: string, data: any) => {
    socketService.emit(event, data);
  };

  return { emitEvent };
};

export default useSocket;
