import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get('/events');
                setEvents(res.data);
            } catch (err) {
                setError('Failed to fetch events');
            }
        };
        fetchEvents();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await API.post('/events', { title, category, date, description });
            setEvents([...events, res.data]);
            setSuccess('Event created successfully!');
            setTitle('');
            setCategory('');
            setDate('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create event');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-8">
                    <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
                    <form onSubmit={handleCreateEvent}>
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Event Title</label>
                            <input
                                type="text"
                                id="title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select 
                                id="category" 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={category} 
                                onChange={e => setCategory(e.target.value)} 
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                                <option value="fun">Fun</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="date"
                                id="date"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                id="description"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Create Event
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Existing Events</h3>
                {events.length > 0 ? (
                    <ul className="bg-white rounded-xl shadow-md overflow-hidden">
                        {events.map(event => (
                            <li key={event._id} className="border-b last:border-b-0 p-4">
                                <h4 className="font-semibold">{event.title}</h4>
                                <p className="text-sm text-gray-600">Category: {event.category}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No events created yet.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
