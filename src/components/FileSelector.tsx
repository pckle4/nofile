import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

const FileSelector: React.FC = () => {
  const { uploadFile } = useFileUpload();
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => uploadFile(file));
    },
    [uploadFile]
  );
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
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
            Drag & drop files here or click to select
          </p>
          
          <button 
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-primary-600 hover:scale-105"
          >
            Select Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;