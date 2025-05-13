import React, { createContext, useContext, ReactNode } from 'react';
import useWebRTC from '../hooks/useWebRTC';
import { ConnectionStatus, FileData, PeerData } from '../types';

interface WebRTCContextType {
  peerId: string;
  peers: PeerData[];
  connectionStatus: ConnectionStatus;
  files: FileData[];
  error: string | null;
  roomId: string | null;
  createRoom: () => string;
  joinRoom: (id: string) => string | undefined;
  sendFile: (file: File) => Promise<void>;
  initializePeerConnection: (initiator: boolean) => void;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const webRTC = useWebRTC();

  return (
    <WebRTCContext.Provider value={webRTC}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTCContext must be used within a WebRTCProvider');
  }
  return context;
};