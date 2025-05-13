import React from 'react';
import { Download, File, Image, Music, Video, FilmIcon, CheckCircle } from 'lucide-react';
import { FileData } from '../types';
import { formatFileSize } from '../utils/fileHelpers';

interface FileItemProps {
  file: FileData;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const getIcon = () => {
    const iconClass = "h-8 w-8";
    if (file.type.startsWith('image/')) return <Image className={`${iconClass} text-accent-500`} />;
    if (file.type.startsWith('video/')) return <FilmIcon className={`${iconClass} text-danger-500`} />;
    if (file.type.startsWith('audio/')) return <Music className={`${iconClass} text-warning-500`} />;
    return <File className={`${iconClass} text-primary-500`} />;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-neutral-100">
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-neutral-800 mb-1">{file.name}</h3>
          <p className="text-neutral-500 text-sm mb-3">{formatFileSize(file.size)}</p>
          
          {file.status === 'complete' && file.url && (
            <a
              href={file.url}
              download={file.name}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 transform hover:scale-105"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </a>
          )}
          
          {file.status === 'sending' && (
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${file.progress || 0}%` }}
              />
            </div>
          )}
          
          {file.status === 'complete' && (
            <div className="flex items-center gap-1 text-success-500 mt-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Ready to share</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileItem;