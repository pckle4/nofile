import React from 'react';
import { useWebRTCContext } from '../context/WebRTCContext';
import FileItem from './FileItem';
import { InboxIcon } from 'lucide-react';

const FilesList: React.FC = () => {
  const { files } = useWebRTCContext();
  
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <InboxIcon className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No files yet</p>
        <p className="text-sm">Files you send or receive will appear here</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 w-full">
      {files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FilesList;