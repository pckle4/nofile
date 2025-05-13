import React, { useState } from 'react';
import { Share2, Upload, FileIcon, Download } from 'lucide-react';
import { useWebRTCContext } from '../context/WebRTCContext';
import FileSelector from '../components/FileSelector';
import FilesList from '../components/FilesList';

const Home: React.FC = () => {
  const { connectionStatus } = useWebRTCContext();
  const [showShareLink, setShowShareLink] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-full bg-primary-100">
                <Share2 className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-4">
              Secure File Sharing
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Share files directly through your browser. Fast, secure, and serverless.
            </p>
          </div>
          
          {/* File Upload Section */}
          <div className="mb-12">
            <FileSelector onShare={() => setShowShareLink(true)} />
          </div>
          
          {/* Files List */}
          <div className="mt-8">
            <FilesList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;