import React, { useState } from 'react';
import { Copy, Link, Plus, LogIn } from 'lucide-react';
import { useWebRTCContext } from '../context/WebRTCContext';

const ConnectionManager: React.FC = () => {
  const { createRoom, joinRoom, roomId, connectionStatus } = useWebRTCContext();
  const [joinRoomId, setJoinRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleCreateRoom = () => {
    createRoom();
  };
  
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId) {
      joinRoom(joinRoomId);
      setJoinRoomId('');
    }
  };
  
  const copyToClipboard = () => {
    if (!roomId) return;
    
    // Build a shareable URL (in real app this would be a proper URL)
    const shareableLink = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(shareableLink);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 max-w-md w-full mx-auto">
      {roomId && connectionStatus === 'connected' ? (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-center mb-4 text-neutral-800">
            Room created successfully!
          </h2>
          
          <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-4">
            <span className="text-neutral-800 font-medium">{roomId}</span>
            <button
              onClick={copyToClipboard}
              className="ml-auto p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              aria-label="Copy link"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center text-sm text-neutral-500">
            {copied ? (
              <span className="text-success-500 font-medium">Link copied to clipboard!</span>
            ) : (
              <span>Share this link with others to connect</span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-neutral-800">
              <Plus className="h-5 w-5 text-primary-500" />
              Create a new room
            </h2>
            <p className="text-neutral-500 text-sm mb-3">
              Start a new room and share the link with others to connect
            </p>
            <button
              onClick={handleCreateRoom}
              disabled={connectionStatus === 'connecting'}
              className="w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <span>Creating room...</span>
                </>
              ) : (
                <>
                  <Link className="h-5 w-5" />
                  <span>Create Room</span>
                </>
              )}
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">or</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-neutral-800">
              <LogIn className="h-5 w-5 text-accent-500" />
              Join an existing room
            </h2>
            <p className="text-neutral-500 text-sm mb-3">
              Enter a room ID to connect to an existing session
            </p>
            
            <form onSubmit={handleJoinRoom} className="flex items-center gap-2">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="flex-grow p-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
                disabled={connectionStatus === 'connecting'}
              />
              <button
                type="submit"
                disabled={!joinRoomId || connectionStatus === 'connecting'}
                className="py-2.5 px-4 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionManager;