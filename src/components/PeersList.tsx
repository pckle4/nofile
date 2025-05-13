import React from 'react';
import { useWebRTCContext } from '../context/WebRTCContext';
import PeerItem from './PeerItem';

const PeersList: React.FC = () => {
  const { peers } = useWebRTCContext();
  
  if (peers.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 text-neutral-700">Connected Peers</h2>
      <div className="space-y-2">
        {peers.map(peer => (
          <PeerItem key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
};

export default PeersList;