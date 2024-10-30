import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { generateEventSuggestion } from '../services/geminiService';

const EventChatbot = ({ onSuggestion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const suggestion = await generateEventSuggestion(userMessage);
            
            const botResponse = `Here's my suggestion for your event:
                
                🎯 ${suggestion.title}
                📍 Category: ${suggestion.category}
                👥 Max Registrations: ${suggestion.maxRegistrations}
                
                📝 ${suggestion.description}`;

            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: botResponse,
                suggestion 
            }]);

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: 'Sorry, I encountered an error while generating suggestions. Please try again.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <FaRobot size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl"
                    >
                        <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-lg">
                            <h3 className="font-bold">Event Assistant</h3>
                            <button onClick={() => setIsOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto p-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
                                >
                                    <div
                                        className={`inline-block p-3 rounded-lg ${
                                            message.type === 'user'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        {message.suggestion && (
                                            <button
                                                onClick={() => onSuggestion(message.suggestion)}
                                                className="mt-2 text-sm bg-white text-indigo-600 px-2 py-1 rounded"
                                            >
                                                Use This Suggestion
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-center">
                                    <div className="animate-bounce">⌛</div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Describe your event idea or mood..."
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 text-white p-2 rounded-lg"
                                >
                                    <FaPaperPlane />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EventChatbot;
