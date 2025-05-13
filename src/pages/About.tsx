import React from 'react';
import { Shield, Lock, Zap, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-6">About WaveDrop</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-neutral-700 mb-6">
            WaveDrop is a peer-to-peer file sharing platform that leverages WebRTC technology to enable direct file transfers between browsers, without uploading files to any server.
          </p>
          
          <h2 className="text-2xl font-semibold text-neutral-800 mt-8 mb-4">How It Works</h2>
          <p className="text-neutral-700 mb-4">
            When you share files with WaveDrop, your data travels directly from your device to the recipient's device. This offers several benefits:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-primary-100 w-fit mb-4">
                <Shield className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-2">Enhanced Privacy</h3>
              <p className="text-neutral-600">
                Your files are never stored on a third-party server, ensuring your data remains private.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-success-100 w-fit mb-4">
                <Lock className="h-6 w-6 text-success-500" />
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-2">Encrypted Transfer</h3>
              <p className="text-neutral-600">
                WebRTC provides built-in encryption, keeping your transfers secure from end to end.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-warning-100 w-fit mb-4">
                <Zap className="h-6 w-6 text-warning-500" />
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-2">Fast Transfers</h3>
              <p className="text-neutral-600">
                Direct connections mean faster transfer speeds without server bottlenecks.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-accent-100 w-fit mb-4">
                <Globe className="h-6 w-6 text-accent-500" />
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-2">No Size Limits</h3>
              <p className="text-neutral-600">
                Share files of any size without the restrictions imposed by email or cloud storage.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-neutral-800 mt-8 mb-4">About WebRTC</h2>
          <p className="text-neutral-700 mb-4">
            Web Real-Time Communication (WebRTC) is an open-source project that provides web browsers and mobile applications with real-time communication capabilities via simple application programming interfaces.
          </p>
          <p className="text-neutral-700 mb-4">
            WebRTC allows audio, video, and data to be exchanged between peers, without requiring an intermediary server to facilitate the transfer.
          </p>
          
          <h2 className="text-2xl font-semibold text-neutral-800 mt-8 mb-4">Privacy & Security</h2>
          <p className="text-neutral-700 mb-4">
            WaveDrop does not store any of your files or transfer data. All connections are created and maintained directly between the peers, with the application only facilitating the initial connection setup.
          </p>
          <p className="text-neutral-700 mb-4">
            In a production environment, a signaling server would be used to help peers discover each other. This demo uses a simulated connection for demonstration purposes.
          </p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Technical Note</h3>
            <p className="text-primary-700">
              This is a demonstration application. In a production environment, a proper signaling server would be implemented to manage WebRTC connection establishment between peers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;