import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaTag, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState('title'); // 'date', 'title', 'maxRegistrations'
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(9);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await API.get('/events');
                setEvents(response.data);
                setFilteredEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let results = [...events];

        // Apply search filter
        if (searchTerm) {
            results = results.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter) {
            results = results.filter(event => event.category === categoryFilter);
        }

        // Improved sorting logic
        results = results.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'maxRegistrations':
                    return b.maxRegistrations - a.maxRegistrations;
                default:
                    return 0;
            }
        });

        setFilteredEvents(results);
    }, [searchTerm, categoryFilter, sortBy, events]);

    const categories = [...new Set(events.map(event => event.category))];

    const getCategoryColor = (category) => {
        switch(category.toLowerCase()) {
            case 'indoor': return 'from-blue-400 to-blue-600';
            case 'outdoor': return 'from-green-400 to-green-600';
            case 'fun': return 'from-yellow-400 to-yellow-600';
            default: return 'from-purple-400 to-purple-600';
        }
    };

    const getCategoryIcon = (category) => {
        switch(category.toLowerCase()) {
            case 'indoor': return '🏢';
            case 'outdoor': return '🌳';
            case 'fun': return '🎮';
            default: return '🎯';
        }
    };

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const EventCard = ({ event }) => (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                     border border-white/20 overflow-hidden transform transition-all duration-300"
            whileHover={{ 
                y: -5,
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
            }}
            onClick={() => navigate(`/event/${event._id}`)}
        >
            <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 p-6`}>
                <h3 className="font-bold text-xl text-white truncate">{event.title}</h3>
                <p className="text-sm text-indigo-100 mt-1">
                    {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {getCategoryIcon(event.category)} {event.category}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {event.maxRegistrations} slots
                    </span>
                </div>
                <p className="text-gray-700 line-clamp-3">{event.description}</p>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                             text-white py-2 px-4 rounded-lg font-medium
                             hover:from-indigo-700 hover:to-purple-700 
                             transition-all duration-300 shadow-md"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/${event._id}`);
                    }}
                >
                    View Details
                </motion.button>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-purple-100 to-indigo-200 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                             border border-white/20 p-6 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-center mb-8 text-indigo-800"
                    >
                        Upcoming Events
                    </motion.h2>

                    {/* Search and Filters */}
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <FaFilter className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {getCategoryIcon(category)} {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <FaSortAmountDown className="absolute left-3 top-3 text-gray-400" />
                                    <select
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >   
                                        <option value="title">Sort by Title</option>
                                        <option value="date">Sort by Date</option>
                                        <option value="maxRegistrations">Sort by Capacity</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Events Grid */}
                <AnimatePresence>
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {currentEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* ... rest of the component (pagination, etc.) ... */}
            </div>
        </div>
    );
};

export default EventList;
