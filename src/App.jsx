import React, { useState } from 'react';
import Background from './components/Background';
import CustomCursor from './components/CustomCursor';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';
import PixelRain from './components/PixelRain';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (name) => {
    setUsername(name);
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
      setIsLoggedIn(true);
    }, 3500);
  };

  return (
    <>
      <CustomCursor />
      <Background />
      <PixelRain />
      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      <AnimatePresence mode="wait">
        {!isLoggedIn && !showWelcome && (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}

        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 100
            }}
          >
            <motion.h1
              className="neon-text-cyan"
              style={{ fontSize: '5rem' }}
              animate={{ textShadow: ["0 0 10px #00f3ff", "0 0 30px #00f3ff", "0 0 10px #00f3ff"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              WELCOME
            </motion.h1>
            <motion.h2
              className="neon-text-pink"
              style={{ fontSize: '3rem', marginTop: '1rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {username}
            </motion.h2>
            <motion.div
              style={{ marginTop: '2rem', width: '200px', height: '4px', background: '#333' }}
            >
              <motion.div
                style={{ height: '100%', background: '#00f3ff' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}

        {isLoggedIn && (
          <ChatInterface key="chat" username={username} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
