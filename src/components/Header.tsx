import React from 'react';
import { Share2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
          <Share2 className="h-6 w-6 text-primary-500" />
          <span>WaveDrop</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ConnectionStatus />
          
          <Link 
            to="/about" 
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="About"
          >
            <Info className="h-5 w-5 text-neutral-600" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;