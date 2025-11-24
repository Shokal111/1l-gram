import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [typedText, setTypedText] = useState('');
    const fullText = "ENTER THE VOID";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i + 1));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
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
                    width: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #00f3ff, #ff00ff)' }} />

                <h1 className="neon-text-cyan" style={{ marginBottom: '0.5rem', fontSize: '3.5rem', textAlign: 'center' }}>1L GRAM</h1>
                <div style={{ marginBottom: '3rem', color: '#00f3ff', opacity: 0.7, letterSpacing: '4px' }}>{typedText}<span className="blink">_</span></div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.8rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '1px' }}>IDENTITY_TOKEN</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ENTER ALIAS..."
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                padding: '1.2rem',
                                color: '#fff',
                                fontSize: '1.4rem',
                                outline: 'none',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00f3ff'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 243, 255, 0.3)'}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 0, 255, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #ff00ff 0%, #00f3ff 100%)',
                            border: 'none',
                            padding: '1.2rem',
                            color: '#000',
                            fontSize: '1.4rem',
                            fontWeight: '900',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        Initialize
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(255,255,255,0.4), transparent)', opacity: 0.3 }} />
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

export default LoginScreen;
