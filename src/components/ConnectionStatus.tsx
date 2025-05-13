import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useWebRTCContext } from '../context/WebRTCContext';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus, roomId } = useWebRTCContext();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-5 w-5 text-success-500" />;
      case 'connecting':
        return <Loader2 className="h-5 w-5 text-warning-500 animate-spin" />;
      case 'disconnected':
      default:
        return <WifiOff className="h-5 w-5 text-neutral-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <span className="text-success-500 font-medium">
            Connected {roomId ? `to room ${roomId}` : ''}
          </span>
        );
      case 'connecting':
        return <span className="text-warning-500 font-medium">Connecting...</span>;
      case 'disconnected':
      default:
        return <span className="text-neutral-500">Not connected</span>;
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-sm border border-neutral-200">
      {getStatusIcon()}
      {getStatusText()}
    </div>
  );
};

export default ConnectionStatus;