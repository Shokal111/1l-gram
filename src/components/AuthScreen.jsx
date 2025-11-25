import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/supabase';

const AuthScreen = ({ onLogin }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [typedText, setTypedText] = useState('');
    const fullText = mode === 'login' ? "ENTER THE VOID" : "JOIN THE FUTURE";

    useEffect(() => {
        let i = 0;
        setTypedText('');
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i + 1));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (!username.trim()) {
                    setError('Username is required');
                    setLoading(false);
                    return;
                }
                await auth.signUp(email, password, username);
                setError('Check your email to confirm your account!');
                setTimeout(() => {
                    setMode('login');
                    setError('');
                }, 3000);
            } else {
                const { user } = await auth.signIn(email, password);
                if (user) {
                    onLogin(user);
                }
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, rotateX: 20 }}
            transition={{ duration: 0.8 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
            }}
        >
            <motion.div
                className="glass-panel"
                initial={{ scale: 0.9, rotateY: 15 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", duration: 1.5 }}
                style={{
                    padding: '4rem',
                    borderRadius: '24px',
                    width: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #00f3ff, #ff00ff)' }} />

                <h1 className="neon-text-cyan" style={{ marginBottom: '0.5rem', fontSize: '3.5rem', textAlign: 'center' }}>1L GRAM</h1>
                <div style={{ marginBottom: '2rem', color: '#00f3ff', opacity: 0.7, letterSpacing: '4px', minHeight: '30px' }}>
                    {typedText}<span className="blink">_</span>
                </div>

                {/* Mode Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMode('login')}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: mode === 'login' ? 'linear-gradient(135deg, #00f3ff, #0066ff)' : 'rgba(255,255,255,0.05)',
                            border: mode === 'login' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: mode === 'login' ? '#000' : '#fff',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px'
                        }}
                    >
                        LOGIN
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMode('signup')}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: mode === 'signup' ? 'linear-gradient(135deg, #ff00ff, #ff0066)' : 'rgba(255,255,255,0.05)',
                            border: mode === 'signup' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: mode === 'signup' ? '#000' : '#fff',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px'
                        }}
                    >
                        SIGN UP
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <AnimatePresence mode="wait">
                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ marginBottom: '1.5rem' }}
                            >
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '1px' }}>USERNAME</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ENTER UNIQUE ID..."
                                    required={mode === 'signup'}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid rgba(0, 243, 255, 0.3)',
                                        padding: '1rem',
                                        color: '#fff',
                                        fontSize: '1.2rem',
                                        outline: 'none',
                                        borderRadius: '12px'
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '1px' }}>EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="NEURAL.LINK@VOID.SPACE"
                            required
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                padding: '1rem',
                                color: '#fff',
                                fontSize: '1.2rem',
                                outline: 'none',
                                borderRadius: '12px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '1px' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255, 0, 255, 0.3)',
                                padding: '1rem',
                                color: '#fff',
                                fontSize: '1.2rem',
                                outline: 'none',
                                borderRadius: '12px'
                            }}
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginBottom: '1.5rem',
                                padding: '0.8rem',
                                background: error.includes('Check your email') ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                border: `1px solid ${error.includes('Check your email') ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
                                borderRadius: '8px',
                                color: error.includes('Check your email') ? '#00ff9d' : '#ff5555',
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 0, 255, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? '#333' : 'linear-gradient(135deg, #ff00ff 0%, #00f3ff 100%)',
                            border: 'none',
                            padding: '1.2rem',
                            color: loading ? '#666' : '#000',
                            fontSize: '1.4rem',
                            fontWeight: '900',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'PROCESSING...' : mode === 'login' ? 'Initialize' : 'Create Account'}
                        {!loading && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(255,255,255,0.4), transparent)', opacity: 0.3 }} />}
                    </motion.button>
                </form>

                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', opacity: 0.5 }}>
                    <div style={{ width: '10px', height: '10px', background: '#00f3ff', borderRadius: '50%' }} />
                    <div style={{ width: '10px', height: '10px', background: '#ff00ff', borderRadius: '50%' }} />
                    <div style={{ width: '10px', height: '10px', background: '#00ff9d', borderRadius: '50%' }} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AuthScreen;
