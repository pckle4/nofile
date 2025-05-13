import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-neutral-50 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-500 text-sm">
            <p>© {new Date().getFullYear()} WaveDrop. Securely share files peer-to-peer.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-primary-500 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <div className="flex items-center gap-1 text-neutral-500 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-danger-500 fill-danger-500" />
              <span>using WebRTC</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;