import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await API.get(`/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                setError('Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!event) return <div className="text-center mt-10">Event not found</div>;

    const handleRegister = () => {
        navigate('/register-team', { 
            state: { 
                eventId: id,
                eventTitle: event.title 
            } 
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
            >
                ← Back
            </motion.button>

            <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="relative h-96">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white text-center">{event.title}</h1>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                            {event.category}
                        </motion.span>
                        <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                            {new Date(event.date).toLocaleDateString()}
                        </motion.span>
                        <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                            Max Registrations: {event.maxRegistrations}
                        </motion.span>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 mb-6">{event.description}</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <button 
                            onClick={handleRegister}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                            Register Team
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventDetails;
