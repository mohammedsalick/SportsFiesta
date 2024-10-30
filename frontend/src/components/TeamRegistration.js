import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { FaUsers, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const TeamRegistration = () => {
    const [teamName, setTeamName] = useState('');
    const [eventId, setEventId] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get('/events');
                setEvents(response.data);
                
                // If we have an eventId from navigation state, find and set the selected event
                if (state?.eventId) {
                    setEventId(state.eventId);
                    const event = response.data.find(e => e._id === state.eventId);
                    setSelectedEvent(event);
                }
            } catch (err) {
                setError('Failed to fetch events');
            }
        };
        fetchEvents();
    }, [state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.post('/teams', { name: teamName, eventId });
            setSuccess('Team registered successfully!');
            setTimeout(() => {
                navigate('/events');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register team');
        } finally {
            setLoading(false);
        }
    };

    const handleEventChange = (e) => {
        setEventId(e.target.value);
        const event = events.find(ev => ev._id === e.target.value);
        setSelectedEvent(event);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 max-w-4xl"
        >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                    <h2 className="text-3xl font-bold text-white text-center">Team Registration</h2>
                </div>

                <div className="p-6 md:p-8">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                        >
                            {success}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teamName">
                                <FaUsers className="inline mr-2" />
                                Team Name
                            </label>
                            <input
                                id="teamName"
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your team name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="event">
                                <FaTrophy className="inline mr-2" />
                                Select Event
                            </label>
                            <select
                                id="event"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventId}
                                onChange={handleEventChange}
                            >
                                <option value="">Select an event</option>
                                {events.map(event => (
                                    <option key={event._id} value={event._id}>
                                        {event.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEvent && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                                <h3 className="font-bold text-lg mb-2">Event Details</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center text-gray-600">
                                        <FaCalendarAlt className="mr-2" />
                                        Date: {new Date(selectedEvent.date).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center text-gray-600">
                                        <FaUsers className="mr-2" />
                                        Max Registrations: {selectedEvent.maxRegistrations}
                                    </p>
                                    <p className="text-gray-600">{selectedEvent.description}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className={`
                                    bg-gradient-to-r from-blue-500 to-purple-600 
                                    text-white font-bold py-3 px-8 rounded-full 
                                    transform transition duration-200
                                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                                `}
                            >
                                {loading ? 'Registering...' : 'Register Team'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default TeamRegistration;
