import { FileData, TransferMetadata } from '../types';

const MAX_CHUNK_SIZE = 16 * 1024; // 16KB chunks

export const createFileFromArrayBuffer = (
  buffer: ArrayBuffer, 
  metadata: TransferMetadata
): File => {
  return new File([buffer], metadata.name, {
    type: metadata.type,
    lastModified: metadata.lastModified,
  });
};

export const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to ArrayBuffer'));
      }
    };
    
    reader.onerror = () => {
      reject(reader.error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const getFileMetadata = (file: File): TransferMetadata => {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified,
  };
};

export const prepareFileData = (file: File): FileData => {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified,
    file,
    progress: 0,
    status: 'pending'
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeIcon = (type: string): string => {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf')) return 'file-text';
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return 'archive';
  if (type.includes('word') || type.includes('document')) return 'file-text';
  if (type.includes('excel') || type.includes('sheet')) return 'file-spreadsheet';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'file-presentation';
  return 'file';
};

// Split file into chunks for efficient transfer
export const getFileChunks = async (file: File): Promise<ArrayBuffer[]> => {
  const buffer = await fileToArrayBuffer(file);
  const chunks: ArrayBuffer[] = [];
  let offset = 0;
  
  while (offset < buffer.byteLength) {
    const chunkSize = Math.min(MAX_CHUNK_SIZE, buffer.byteLength - offset);
    const chunk = buffer.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }
  
  return chunks;
};

// Generate a download URL for a received file
export const createDownloadLink = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up object URLs to prevent memory leaks
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};