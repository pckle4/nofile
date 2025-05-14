import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { nanoid } from 'nanoid';
import { Buffer } from 'buffer';
import { ConnectionStatus, FileData, PeerData, TransferMetadata } from '../types';

const CHUNK_SIZE = 16384; // 16KB chunks for efficient transfer

const useWebRTC = () => {
  const [peerId] = useState(() => nanoid(32));
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const peerRef = useRef<Peer.Instance | null>(null);
  const chunksBuffer = useRef<Map<string, Uint8Array[]>>(new Map());
  const fileMetadata = useRef<Map<string, TransferMetadata>>(new Map());

  const initializePeer = useCallback((initiator: boolean) => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('signal', data => {
      const signalData = JSON.stringify(data);
      // In production, send this to signaling server
      console.log('Signal data:', signalData);
    });

    peer.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Peer connection established');
    });

    peer.on('data', handleIncomingData);

    peer.on('error', err => {
      console.error('Peer connection error:', err);
      setError(err.message);
      setConnectionStatus('disconnected');
    });

    peer.on('close', () => {
      setConnectionStatus('disconnected');
      setPeers([]);
    });

    peerRef.current = peer;
    return peer;
  }, []);

  const handleIncomingData = useCallback((data: Uint8Array) => {
    try {
      const message = JSON.parse(Buffer.from(data).toString());
      
      if (message.type === 'file-metadata') {
        const metadata: TransferMetadata = message.data;
        fileMetadata.current.set(metadata.id, metadata);
        chunksBuffer.current.set(metadata.id, []);
        
        setFiles(prev => [...prev, {
          ...metadata,
          progress: 0,
          status: 'receiving',
          url: null
        }]);
      }
      else if (message.type === 'file-chunk') {
        const { fileId, chunk, index, total } = message.data;
        const chunks = chunksBuffer.current.get(fileId) || [];
        chunks[index] = new Uint8Array(chunk);
        chunksBuffer.current.set(fileId, chunks);
        
        const progress = Math.floor((chunks.filter(Boolean).length / total) * 100);
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress } : file
        ));
        
        if (chunks.filter(Boolean).length === total) {
          completeFileTransfer(fileId);
        }
      }
    } catch (err) {
      console.error('Error processing incoming data:', err);
    }
  }, []);

  const completeFileTransfer = useCallback((fileId: string) => {
    const chunks = chunksBuffer.current.get(fileId);
    const metadata = fileMetadata.current.get(fileId);
    
    if (!chunks || !metadata) return;
    
    const completeFile = new Blob(chunks, { type: metadata.type });
    const url = URL.createObjectURL(completeFile);
    
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        status: 'complete',
        progress: 100,
        url 
      } : file
    ));
    
    chunksBuffer.current.delete(fileId);
    fileMetadata.current.delete(fileId);
  }, []);

  const sendFile = useCallback(async (file: File) => {
    if (!peerRef.current || connectionStatus !== 'connected') {
      setError('No active connection');
      return;
    }

    try {
      const fileId = nanoid();
      const metadata: TransferMetadata = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };

      setFiles(prev => [...prev, {
        ...metadata,
        progress: 0,
        status: 'sending',
        url: null
      }]);

      // Send metadata first
      peerRef.current.send(Buffer.from(JSON.stringify({
        type: 'file-metadata',
        data: metadata
      })));

      // Read and send file in chunks
      const reader = new FileReader();
      let offset = 0;
      let chunkIndex = 0;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
      };

      reader.onload = (e) => {
        if (!e.target?.result || !peerRef.current) return;

        const chunk = new Uint8Array(e.target.result as ArrayBuffer);
        peerRef.current.send(Buffer.from(JSON.stringify({
          type: 'file-chunk',
          data: {
            fileId,
            chunk: Array.from(chunk),
            index: chunkIndex,
            total: totalChunks
          }
        })));

        const progress = Math.floor((chunkIndex + 1) / totalChunks * 100);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));

        offset += chunk.length;
        chunkIndex++;

        if (offset < file.size) {
          readNextChunk();
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'complete' } : f
          ));
        }
      };

      readNextChunk();
    } catch (err) {
      console.error('Error sending file:', err);
      setError(err instanceof Error ? err.message : 'Failed to send file');
    }
  }, [connectionStatus]);

  const createRoom = useCallback(() => {
    const newRoomId = nanoid(32);
    setRoomId(newRoomId);
    initializePeer(true);
    return newRoomId;
  }, [initializePeer]);

  const joinRoom = useCallback((id: string) => {
    setRoomId(id);
    setConnectionStatus('connecting');
    initializePeer(false);
    return id;
  }, [initializePeer]);

  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      // Cleanup object URLs
      files.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

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
    initializePeer,
  };
};

export default useWebRTC;