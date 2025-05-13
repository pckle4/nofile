import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebRTCProvider } from './context/WebRTCContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  useEffect(() => {
    document.title = 'WaveDrop - P2P File Sharing';
  }, []);

  return (
    <WebRTCProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-neutral-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WebRTCProvider>
  );
}

export default App;