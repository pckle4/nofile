import React from 'react';
import { User, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { PeerData } from '../types';

interface PeerItemProps {
  peer: PeerData;
  onDisconnect?: (id: string) => void;
}

const PeerItem: React.FC<PeerItemProps> = ({ peer, onDisconnect }) => {
  const getStatusIcon = () => {
    switch (peer.status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-success-500" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 text-warning-500 animate-spin" />;
      case 'disconnected':
      default:
        return <WifiOff className="h-4 w-4 text-neutral-400" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary-100">
          <User className="h-5 w-5 text-primary-500" />
        </div>
        
        <div>
          <p className="font-medium text-neutral-800">
            {peer.name || `Peer ${peer.id.substring(0, 6)}`}
          </p>
          <div className="flex items-center gap-1 text-sm">
            {getStatusIcon()}
            <span className={`
              ${peer.status === 'connected' ? 'text-success-500' : ''}
              ${peer.status === 'connecting' ? 'text-warning-500' : ''}
              ${peer.status === 'disconnected' ? 'text-neutral-500' : ''}
            `}>
              {peer.status === 'connected' ? 'Connected' : ''}
              {peer.status === 'connecting' ? 'Connecting...' : ''}
              {peer.status === 'disconnected' ? 'Disconnected' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {onDisconnect && peer.status === 'connected' && (
        <button
          onClick={() => onDisconnect(peer.id)}
          className="px-3 py-1 text-sm text-danger-500 hover:bg-danger-50 rounded-full transition-colors"
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default PeerItem;