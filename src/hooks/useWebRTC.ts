import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { nanoid } from 'nanoid';
import { ConnectionStatus, FileData, PeerData, TransferMetadata } from '../types';
import { createFileFromArrayBuffer, getFileChunks, getFileMetadata, createDownloadLink } from '../utils/fileHelpers';

// Normally this would be handled by a signaling server
// For demo purposes, we'll simulate connections locally
const useWebRTC = () => {
  const [peerId] = useState(() => nanoid(10));
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const peerConnection = useRef<Peer.Instance | null>(null);
  const chunksBuffer = useRef<Map<string, ArrayBuffer[]>>(new Map());
  const metadataBuffer = useRef<Map<string, TransferMetadata>>(new Map());

  // For real implementation, this would connect to a signaling server
  const createRoom = useCallback(() => {
    const newRoomId = nanoid(6);
    setRoomId(newRoomId);
    setConnectionStatus('connected'); // In real app, this would be updated based on connection events
    
    // In a real app, you would register with a signaling server here
    console.log(`Created room: ${newRoomId} with peer ID: ${peerId}`);
    
    return newRoomId;
  }, [peerId]);

  // For real implementation, this would use the signaling server
  const joinRoom = useCallback((id: string) => {
    if (!id) return;
    
    setRoomId(id);
    setConnectionStatus('connecting');
    
    // In a real app, you would connect to peers in the room via signaling server
    // For demo, we'll simulate a successful connection after a delay
    setTimeout(() => {
      const demoRemotePeer: PeerData = {
        id: nanoid(10),
        name: 'Demo Peer',
        status: 'connected'
      };
      
      setPeers(prev => [...prev, demoRemotePeer]);
      setConnectionStatus('connected');
      
      console.log(`Joined room: ${id} with peer ID: ${peerId}`);
    }, 1500);
    
    return id;
  }, [peerId]);

  // Initialize a WebRTC peer connection
  const initializePeerConnection = useCallback((initiator: boolean) => {
    if (peerConnection.current) {
      peerConnection.current.destroy();
    }

    const peer = new Peer({
      initiator,
      trickle: false,
    });

    // Handle signals (would work with a signaling server in production)
    peer.on('signal', data => {
      console.log('Generated signal data (send this to the remote peer):', data);
      // In a real app: send this signal data to the remote peer via signaling server
    });

    // Handle connection
    peer.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Peer connection established');
    });

    // Handle data transfer
    peer.on('data', data => {
      handleIncomingData(data);
    });

    // Handle errors
    peer.on('error', err => {
      console.error('Peer connection error:', err);
      setError(`Connection error: ${err.message}`);
      setConnectionStatus('disconnected');
    });

    // Handle connection close
    peer.on('close', () => {
      console.log('Peer connection closed');
      setConnectionStatus('disconnected');
    });

    peerConnection.current = peer;
    return peer;
  }, []);

  // Process incoming data chunks
  const handleIncomingData = useCallback((data: Uint8Array) => {
    const message = JSON.parse(new TextDecoder().decode(data));

    if (message.type === 'metadata') {
      // Store file metadata for later use
      const metadata: TransferMetadata = message.data;
      metadataBuffer.current.set(metadata.id, metadata);
      
      // Initialize file entry in state
      setFiles(prev => [
        ...prev, 
        {
          ...metadata,
          progress: 0,
          status: 'receiving'
        }
      ]);
      
      // Initialize chunk storage for this file
      chunksBuffer.current.set(metadata.id, []);
    } 
    else if (message.type === 'chunk') {
      const { fileId, chunk, index, total } = message.data;
      const chunks = chunksBuffer.current.get(fileId) || [];
      
      // Store chunk in the correct position
      chunks[index] = chunk;
      chunksBuffer.current.set(fileId, chunks);
      
      // Update progress
      const progress = Math.floor((chunks.filter(Boolean).length / total) * 100);
      setFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress } 
            : file
        )
      );
      
      // Check if transfer is complete
      if (chunks.filter(Boolean).length === total) {
        completeFileTransfer(fileId);
      }
    }
  }, []);

  // Complete file transfer and create download link
  const completeFileTransfer = useCallback((fileId: string) => {
    const chunks = chunksBuffer.current.get(fileId) || [];
    const metadata = metadataBuffer.current.get(fileId);
    
    if (!metadata) {
      console.error('No metadata found for file:', fileId);
      return;
    }
    
    // Combine chunks into a single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
    const completeBuffer = new ArrayBuffer(totalLength);
    const view = new Uint8Array(completeBuffer);
    
    let offset = 0;
    for (const chunk of chunks) {
      view.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
    
    // Create a File object from the buffer
    const file = createFileFromArrayBuffer(completeBuffer, metadata);
    const url = createDownloadLink(file);
    
    // Update file state
    setFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'complete', url, file } 
          : f
      )
    );
    
    // Clean up buffers
    chunksBuffer.current.delete(fileId);
    metadataBuffer.current.delete(fileId);
  }, []);

  // Send a file to connected peer
  const sendFile = useCallback(async (file: File) => {
    if (!peerConnection.current || connectionStatus !== 'connected') {
      setError('No active connection');
      return;
    }
    
    try {
      // Prepare file data and update UI
      const metadata = getFileMetadata(file);
      setFiles(prev => [
        ...prev,
        {
          ...metadata,
          file,
          progress: 0,
          status: 'sending'
        }
      ]);
      
      // Send metadata first
      peerConnection.current.send(
        new TextEncoder().encode(
          JSON.stringify({
            type: 'metadata',
            data: metadata
          })
        )
      );
      
      // Split file into chunks and send
      const chunks = await getFileChunks(file);
      
      for (let i = 0; i < chunks.length; i++) {
        peerConnection.current.send(
          new TextEncoder().encode(
            JSON.stringify({
              type: 'chunk',
              data: {
                fileId: metadata.id,
                chunk: chunks[i],
                index: i,
                total: chunks.length
              }
            })
          )
        );
        
        // Update progress
        const progress = Math.floor(((i + 1) / chunks.length) * 100);
        setFiles(prev => 
          prev.map(f => 
            f.id === metadata.id 
              ? { ...f, progress } 
              : f
          )
        );
        
        // Small delay to prevent overwhelming the connection
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Mark as complete
      setFiles(prev => 
        prev.map(f => 
          f.id === metadata.id 
            ? { ...f, status: 'complete' } 
            : f
        )
      );
    } catch (err) {
      console.error('Error sending file:', err);
      setError(`Failed to send file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Update file status
      setFiles(prev => 
        prev.map(f => 
          f.id === metadata.id 
            ? { ...f, status: 'error', error: 'Transfer failed' } 
            : f
        )
      );
    }
  }, [connectionStatus]);

  // In a real app, this would connect to the signaling server and handle room validation
  useEffect(() => {
    // Clean up connection when component unmounts
    return () => {
      if (peerConnection.current) {
        peerConnection.current.destroy();
      }
    };
  }, []);

  return {
    peerId,
    peers,
    connectionStatus,
    files,
    error,
    roomId,
    createRoom,
    joinRoom,
    sendFile,
    initializePeerConnection,
  };
};

export default useWebRTC;