import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Hash, Plus, Settings as SettingsIcon, LogOut, MessageCircle } from 'lucide-react';
import { profiles, directMessages } from '../lib/supabase';

const MessengerUI = ({ user, profile, onSignOut }) => {
    const [activeView, setActiveView] = useState('dm');
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (activeView === 'dm') {
            loadConversations();
        }
    }, [activeView, user]);

    useEffect(() => {
        if (selectedChat && activeView === 'dm') {
            loadMessages(selectedChat.user.id);

            const subscription = directMessages.subscribeToMessages(
                user.id,
                selectedChat.user.id,
                (newMessage) => {
                    setMessages(prev => [...prev, newMessage]);
                    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [selectedChat, user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadConversations = async () => {
        try {
            const convos = await directMessages.getConversations(user.id);
            setConversations(convos);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadMessages = async (otherUserId) => {
        try {
            const msgs = await directMessages.getMessages(user.id, otherUserId);
            setMessages(msgs);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedChat) return;

        try {
            const newMessage = await directMessages.sendMessage(
                user.id,
                selectedChat.user.id,
                inputText
            );

            setMessages([...messages, { ...newMessage, sender: profile }]);
            setInputText('');
            loadConversations();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await profiles.searchUsers(query);
            setSearchResults(results.filter(u => u.id !== user.id));
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const startConversation = (userData) => {
        setSelectedChat({ user: userData, unreadCount: 0 });
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', padding: '20px', gap: '20px' }}>

            {/* Left Sidebar */}
            <motion.div
                className="glass-panel"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ width: '80px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '20px', zIndex: 20 }}
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(45deg, #00f3ff, #0066ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 0 15px #00f3ff', cursor: 'pointer' }}
                    className="clickable"
                >
                    1L
                </motion.div>

                <div className="clickable"
                    onClick={() => setActiveView('dm')}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', background: activeView === 'dm' ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeView === 'dm' ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <MessageCircle size={24} color={activeView === 'dm' ? '#00f3ff' : '#fff'} />
                </div>

                <div style={{ marginTop: 'auto', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', border: '1px solid #ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    className="clickable"
                    onClick={onSignOut}
                >
                    <LogOut size={24} color="#ff0000" />
                </div>
            </motion.div>

            {/* Middle - Conversations List */}
            <motion.div
                className="glass-panel"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{ width: '320px', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', zIndex: 19 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="neon-text-cyan" style={{ fontSize: '1.5rem' }}>MESSAGES</h2>
                    <motion.div
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        className="clickable"
                        onClick={() => setShowSearch(!showSearch)}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        {showSearch ? <Search size={20} color="#00f3ff" /> : <Plus size={20} color="#00f3ff" />}
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginBottom: '15px' }}
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search users..."
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    padding: '12px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    borderRadius: '12px'
                                }}
                            />

                            {searchResults.length > 0 && (
                                <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {searchResults.map(result => (
                                        <motion.div
                                            key={result.id}
                                            whileHover={{ x: 5, backgroundColor: 'rgba(0, 243, 255, 0.1)' }}
                                            onClick={() => startConversation(result)}
                                            style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}
                                        >
                                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: `hsl(${result.username?.length * 30}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {result.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ color: '#00f3ff', fontWeight: 'bold' }}>{result.username}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{result.display_name}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {conversations.length > 0 ? (
                        conversations.map((conv) => (
                            <motion.div
                                key={conv.user.id}
                                whileHover={{ x: 5, backgroundColor: 'rgba(0, 243, 255, 0.1)' }}
                                onClick={() => setSelectedChat(conv)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: selectedChat?.user.id === conv.user.id ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                                    border: selectedChat?.user.id === conv.user.id ? '1px solid rgba(0, 243, 255, 0.4)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                                className="clickable"
                            >
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `hsl(${conv.user.username?.length * 30}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {conv.user.username?.[0]?.toUpperCase()}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ color: '#00f3ff', fontWeight: 'bold', fontSize: '1rem' }}>{conv.user.username}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {conv.lastMessage?.content || 'No messages yet'}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
                            <Search size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                            <div>No conversations yet</div>
                            <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>Click + to search for users</div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff00ff, #00f3ff)' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{profile?.username}</div>
                        <div style={{ fontSize: '0.75rem', color: '#00ff9d' }}>ONLINE</div>
                    </div>
                </div>
            </motion.div>

            {/* Right - Chat Area */}
            <motion.div
                className="glass-panel"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ flex: 1, borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 18 }}
            >
                {selectedChat ? (
                    <>
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `hsl(${selectedChat.user.username?.length * 30}, 70%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.3rem' }}>
                                    {selectedChat.user.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>{selectedChat.user.username}</h2>
                                    <div style={{ fontSize: '0.85rem', color: '#00ff9d' }}>Online</div>
                                </div>
                            </div>
                            <SettingsIcon color="#aaa" size={24} className="clickable" style={{ cursor: 'pointer' }} />
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg) => {
                                const isMine = msg.sender_id === user.id;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: isMine ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%', flexDirection: isMine ? 'row-reverse' : 'row' }}
                                    >
                                        {!isMine && (
                                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `hsl(${msg.sender?.username?.length * 30}, 70%, 50%)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                                                {msg.sender?.username?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            {!isMine && (
                                                <div style={{ color: '#00f3ff', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                                                    {msg.sender?.username}
                                                </div>
                                            )}
                                            <div style={{
                                                lineHeight: '1.5',
                                                color: '#eee',
                                                background: isMine ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                                                padding: '12px 16px',
                                                borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                border: `1px solid ${isMine ? 'rgba(0, 243, 255, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                                                wordBreak: 'break-word'
                                            }}>
                                                {msg.content}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
                            <form onSubmit={handleSendMessage} style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={`Message ${selectedChat.user.username}...`}
                                    style={{
                                        width: '100%',
                                        padding: '15px 60px 15px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0, 243, 255, 0.2)',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="clickable"
                                    disabled={!inputText.trim()}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: inputText.trim() ? 'linear-gradient(135deg, #00f3ff, #0066ff)' : 'transparent',
                                        border: 'none',
                                        color: inputText.trim() ? '#000' : '#444',
                                        cursor: inputText.trim() ? 'pointer' : 'default',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <MessageCircle size={80} style={{ opacity: 0.2, marginBottom: '20px' }} color="#00f3ff" />
                        <h2 className="neon-text-cyan" style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome to 1L Gram</h2>
                        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Select a conversation or start a new one</p>
                    </div>
                )}
            </motion.div>

        </div>
    );
};

export default MessengerUI;
