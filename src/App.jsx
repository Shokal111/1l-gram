import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import CustomCursor from './components/CustomCursor';
import AuthScreen from './components/AuthScreen';
import PixelRain from './components/PixelRain';
import MessengerUI from './components/MessengerUI';
import { AnimatePresence, motion } from 'framer-motion';
import { auth, profiles } from './lib/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check current session
    auth.getCurrentUser().then(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        loadProfile(currentUser.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId) => {
    try {
      const userProfile = await profiles.getProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogin = async (userData) => {
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 3500);
  };

  if (loading) {
    return (
      <>
        <Background />
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#00f3ff',
          fontSize: '2rem',
          fontFamily: 'Orbitron'
        }}>
          LOADING...
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Background />
      <PixelRain />
      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      <AnimatePresence mode="wait">
        {!user && !showWelcome && (
          <AuthScreen key="auth" onLogin={handleLogin} />
        )}

        {showWelcome && profile && (
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
              {profile.username}
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

        {user && profile && !showWelcome && (
          <MessengerUI key="messenger" user={user} profile={profile} onSignOut={() => auth.signOut()} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
