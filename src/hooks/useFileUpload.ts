import { useState } from 'react';
import { getApiUrl } from '../config/api';
import { FileData } from '../types';

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    try {
      const fileId = crypto.randomUUID();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Add initial file to state
      setFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        status: 'sending',
        progress: 0
      }]);

      // Upload file
      const response = await fetch(getApiUrl('/upload'), {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update file with download URL
      setFiles(prev => prev.map(f => 
        f.id === fileId ? {
          ...f,
          status: 'complete',
          progress: 100,
          url: data.url
        } : f
      ));

      return data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    }
  };

  return {
    files,
    error,
    uploadFile
  };
};