export type ConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected';

export interface PeerData {
  id: string;
  name?: string;
  status: ConnectionStatus;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file?: File;
  url?: string;
  progress?: number;
  status: 'pending' | 'sending' | 'receiving' | 'complete' | 'error';
  error?: string;
}

export interface TransferMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}