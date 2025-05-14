import React from 'react';
import { Download, File, Image, Music, Video, FilmIcon, CheckCircle, Link as LinkIcon } from 'lucide-react';
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

  const copyShareLink = () => {
    if (!file.url) return;
    navigator.clipboard.writeText(file.url);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-neutral-100">
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-neutral-800 mb-1 line-clamp-1">{file.name}</h3>
          <p className="text-neutral-500 text-sm mb-3">{formatFileSize(file.size)}</p>
          
          {file.status === 'sending' || file.status === 'receiving' ? (
            <div className="space-y-2">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
                  style={{ width: `${file.progress || 0}%` }}
                />
              </div>
              <p className="text-sm text-neutral-600">
                {file.status === 'sending' ? 'Sending' : 'Receiving'}: {file.progress}%
              </p>
            </div>
          ) : file.status === 'complete' && file.url ? (
            <div className="space-y-3">
              <a
                href={file.url}
                download={file.name}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>Download File</span>
              </a>
              
              <button
                onClick={copyShareLink}
                className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                <span className="text-sm">Copy Share Link</span>
              </button>
              
              <div className="flex items-center gap-1 text-success-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Ready to share</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FileItem;