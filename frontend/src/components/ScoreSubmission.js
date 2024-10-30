import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const ScoreSubmission = () => {
    const [eventId, setEventId] = useState('');
    const [teamId, setTeamId] = useState('');
    const [points, setPoints] = useState('');
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get('/events');
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events');
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            if (eventId) {
                setLoading(true);
                try {
                    const response = await API.get(`/teams?eventId=${eventId}`);
                    setTeams(response.data);
                } catch (err) {
                    setError('Failed to fetch teams');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchTeams();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await API.post('/scores', { 
                eventId, 
                teamId, 
                points: Number(points)
            });
            setSuccess('Score submitted successfully!');
            setTeamId('');
            setPoints('');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to submit score');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Submit Score
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" 
                            role="alert"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" 
                            role="alert"
                        >
                            {success}
                        </motion.div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="event" className="sr-only">Event</label>
                            <select
                                id="event"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                            >
                                <option value="">Select Event</option>
                                {events.map(event => (
                                    <option key={event._id} value={event._id}>{event.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="team" className="sr-only">Team</label>
                            <select
                                id="team"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                                disabled={!eventId || loading}
                            >
                                <option value="">Select Team</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="points" className="sr-only">Points</label>
                            <input
                                id="points"
                                name="points"
                                type="number"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Points"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Submit Score'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ScoreSubmission;
