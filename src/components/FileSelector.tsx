import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileIcon } from 'lucide-react';
import { useWebRTCContext } from '../context/WebRTCContext';

interface FileSelectorProps {
  onShare: () => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onShare }) => {
  const { sendFile } = useWebRTCContext();
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => {
        sendFile(file);
        onShare();
      });
    },
    [sendFile, onShare]
  );
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-3 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-neutral-300 hover:border-primary-400 bg-white'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary-100 mb-4">
            <Upload className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {isDragActive ? 'Drop your files here' : 'Upload your files'}
          </h3>
          <p className="text-neutral-600 mb-4">
            Drag & drop files here or click to select
          </p>
          <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;