import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image, Smile, Hash, Volume2, Settings, Search, Zap, Globe, Cpu } from 'lucide-react';

// Mock Data
const CHANNELS = [
    { id: 1, name: 'general', type: 'text' },
    { id: 2, name: 'announcements', type: 'text' },
    { id: 3, name: 'voice-lounge', type: 'voice' },
    { id: 4, name: 'memes', type: 'text' },
    { id: 5, name: 'music-bot', type: 'text' },
    { id: 6, name: 'dev-logs', type: 'text' },
];

const USERS = [
    { id: 1, name: 'NeonRider', status: 'online', color: '#00f3ff' },
    { id: 2, name: 'CyberPunk_99', status: 'idle', color: '#ff00ff' },
    { id: 3, name: 'GlitchMaster', status: 'dnd', color: '#00ff9d' },
    { id: 4, name: 'AI_Core', status: 'online', color: '#ffffff', isBot: true },
    { id: 5, name: 'VoidWalker', status: 'offline', color: '#aaaaaa' },
];

const INITIAL_MESSAGES = [
    { id: 1, user: 'NeonRider', text: 'Has anyone seen the new update?', time: '10:42 AM' },
    { id: 2, user: 'GlitchMaster', text: 'Yeah, the liquid physics are insane.', time: '10:43 AM' },
    { id: 3, user: 'AI_Core', text: 'System optimization complete. Efficiency increased by 400%.', time: '10:44 AM', isBot: true },
];

const ChatInterface = ({ username }) => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [activeChannel, setActiveChannel] = useState('general');
    const chatEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: username || 'User',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setIsTyping(false);

        // Simulate AI response if mentioned or random
        if (inputText.includes('@1L') || Math.random() > 0.8) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    user: 'AI_Core',
                    text: `Processing input: "${inputText}". Analysis: 100% Awesome.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isBot: true
                }]);
            }, 1000);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', padding: '20px', gap: '20px', overflow: 'hidden' }}>

            {/* Sidebar - Servers */}
            <motion.div
                className="glass-panel"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ width: '80px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '20px', zIndex: 20 }}
            >
                <motion.div whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.5 }} style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(45deg, #00f3ff, #0066ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 0 15px #00f3ff' }}>1L</motion.div>
                <div className="clickable" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={24} color="#fff" /></div>
                <div className="clickable" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={24} color="#ff00ff" /></div>
                <div style={{ marginTop: 'auto', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', border: '1px solid #ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Settings size={24} color="#ff0000" />
                </div>
            </motion.div>

            {/* Channel List */}
            <motion.div
                className="glass-panel"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ width: '260px', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', zIndex: 19 }}
            >
                <h2 className="neon-text-pink" style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={24} /> NETWORKS
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {CHANNELS.map(channel => (
                        <motion.div
                            key={channel.id}
                            whileHover={{ x: 5, backgroundColor: 'rgba(0, 243, 255, 0.1)' }}
                            onClick={() => setActiveChannel(channel.name)}
                            style={{
                                padding: '12px',
                                borderRadius: '12px',
                                background: activeChannel === channel.name ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                                border: activeChannel === channel.name ? '1px solid rgba(0, 243, 255, 0.4)' : '1px solid transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: activeChannel === channel.name ? '#00f3ff' : '#aaa',
                                transition: 'all 0.2s'
                            }}
                        >
                            {channel.type === 'voice' ? <Volume2 size={18} /> : <Hash size={18} />}
                            <span style={{ fontSize: '1.1rem' }}>{channel.name}</span>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff00ff, #00f3ff)' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{username || 'USER_01'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#00ff9d' }}>ONLINE</div>
                    </div>
                </div>
            </motion.div>

            {/* Main Chat */}
            <motion.div
                className="glass-panel"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ flex: 1, borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 18 }}
            >
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Hash size={28} color="#00f3ff" />
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>{activeChannel}</h2>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Topic: Discussing the future of humanity...</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Search color="#aaa" className="clickable" />
                        <Settings color="#aaa" className="clickable" />
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', maxWidth: '80%' }}
                        >
                            <div style={{
                                width: '45px', height: '45px', borderRadius: '12px',
                                background: msg.isBot ? 'linear-gradient(135deg, #ff0000, #ff00ff)' : `hsl(${msg.user.length * 30}, 70%, 50%)`,
                                boxShadow: msg.isBot ? '0 0 15px rgba(255, 0, 255, 0.5)' : 'none',
                                flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem', fontWeight: 'bold'
                            }}>
                                {msg.user[0]}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '5px' }}>
                                    <span style={{ color: msg.isBot ? '#ff00ff' : '#00f3ff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }} className="clickable">{msg.user}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{msg.time}</span>
                                    {msg.isBot && <span style={{ background: 'rgba(255, 0, 255, 0.2)', color: '#ff00ff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid rgba(255, 0, 255, 0.5)' }}>AI</span>}
                                </div>
                                <div style={{
                                    lineHeight: '1.5',
                                    color: '#eee',
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '10px 15px',
                                    borderRadius: '0 12px 12px 12px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
                    <form onSubmit={handleSend} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '10px' }}>
                            <div className="clickable" style={{ cursor: 'pointer', color: '#00f3ff' }}><Image size={20} /></div>
                        </div>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setIsTyping(true);
                            }}
                            onBlur={() => setIsTyping(false)}
                            placeholder={`Message #${activeChannel}`}
                            style={{
                                width: '100%',
                                padding: '15px 60px 15px 50px',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 243, 255, 0.2)',
                                background: 'rgba(0, 0, 0, 0.4)',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none',
                                boxShadow: isTyping ? '0 0 20px rgba(0, 243, 255, 0.1)' : 'none',
                                transition: 'all 0.3s'
                            }}
                        />
                        <button
                            type="submit"
                            className="clickable"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: inputText.trim() ? '#00f3ff' : '#444',
                                cursor: inputText.trim() ? 'pointer' : 'default',
                                transition: 'color 0.3s'
                            }}
                        >
                            <Send size={24} />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* User List */}
            <motion.div
                className="glass-panel"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ width: '260px', borderRadius: '20px', padding: '20px', zIndex: 18 }}
            >
                <h2 className="neon-text-cyan" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>ONLINE — {USERS.length}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {USERS.map(user => (
                        <motion.div
                            key={user.id}
                            whileHover={{ x: -5, scale: 1.02 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                            className="clickable"
                        >
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: user.isBot ? '#333' : `hsl(${user.name.length * 40}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {user.name[0]}
                                </div>
                                <div style={{
                                    position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', borderRadius: '50%',
                                    background: user.status === 'online' ? '#00ff9d' : user.status === 'idle' ? '#ffaa00' : '#ff0000',
                                    border: '2px solid rgba(0,0,0,0.8)',
                                    boxShadow: `0 0 5px ${user.status === 'online' ? '#00ff9d' : user.status === 'idle' ? '#ffaa00' : '#ff0000'}`
                                }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: user.color, textShadow: `0 0 5px ${user.color}`, fontWeight: 'bold' }}>{user.name}</span>
                                <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{user.isBot ? 'SYSTEM AI' : 'MEMBER'}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(255, 0, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 0, 255, 0.1)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#ff00ff', marginBottom: '10px' }}>NOW PLAYING</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '8px' }} />
                        <div>
                            <div style={{ fontSize: '0.9rem' }}>Cyber City</div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Synthwave Mix</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '10px', borderRadius: '2px' }}>
                        <div style={{ width: '60%', height: '100%', background: '#ff00ff', borderRadius: '2px' }} />
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default ChatInterface;
