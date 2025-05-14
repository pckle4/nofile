import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useWebRTCContext } from '../context/WebRTCContext';

const FileSelector: React.FC = () => {
  const { sendFile, connectionStatus } = useWebRTCContext();
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => sendFile(file));
    },
    [sendFile]
  );
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled: connectionStatus !== 'connected'
  });
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden border-3 border-dashed rounded-xl p-12 transition-all duration-300
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 scale-102' 
            : 'border-neutral-300 hover:border-primary-400 bg-white hover:bg-neutral-50'
          }
          ${connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className={`
            p-4 rounded-full mb-4 transition-colors duration-300
            ${isDragActive ? 'bg-primary-100' : 'bg-neutral-100'}
          `}>
            <Upload className={`
              h-8 w-8 transition-colors duration-300
              ${isDragActive ? 'text-primary-500' : 'text-neutral-500'}
            `} />
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-neutral-800">
            {isDragActive ? 'Drop your files here' : 'Share your files'}
          </h3>
          
          <p className="text-neutral-600 mb-4">
            {connectionStatus === 'connected' 
              ? 'Drag & drop files here or click to select' 
              : 'Connect to a peer first to share files'}
          </p>
          
          <button 
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-300
              ${connectionStatus === 'connected'
                ? 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'}
            `}
            disabled={connectionStatus !== 'connected'}
          >
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;