import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaImage, FaTags } from 'react-icons/fa';
import EventChatbot from './EventChatbot';

const EventCreate = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('indoor');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [maxRegistrations, setMaxRegistrations] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await API.post('/events', { 
        title, 
        category, 
        description, 
        date, 
        maxRegistrations: Number(maxRegistrations),
        imageUrl
      });
      setSuccess('Event created successfully!');
      setTitle('');
      setCategory('indoor');
      setDescription('');
      setDate('');
      setMaxRegistrations('');
      setImageUrl('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to create event');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChatbotSuggestion = (suggestion) => {
    try {
      setTitle(suggestion.title || '');
      setCategory(suggestion.category || 'indoor');
      setDescription(suggestion.description || '');
      setMaxRegistrations(suggestion.maxRegistrations?.toString() || '');
      
      // Show success message
      setSuccess('Suggestion applied successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error applying suggestion:', error);
      setError('Failed to apply suggestion');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create New Event
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your amazing event
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" 
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" 
              role="alert"
            >
              <p className="font-bold">Success</p>
              <p>{success}</p>
            </motion.div>
          )}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTags className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="category"
                  name="category"
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="fun">Fun</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
                <span className="text-xs text-gray-500 ml-1">(Max 500 characters)</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  maxLength="500"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">{500 - description.length} characters remaining</p>
            </div>
            <div>
              <label htmlFor="maxRegistrations" className="block text-sm font-medium text-gray-700">Max Registrations</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="maxRegistrations"
                  name="maxRegistrations"
                  type="number"
                  required
                  min="1"
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={maxRegistrations}
                  onChange={(e) => setMaxRegistrations(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Create Event'}
            </motion.button>
          </div>
        </form>
      </motion.div>
      <EventChatbot onSuggestion={handleChatbotSuggestion} />
    </div>
  );
};

export default EventCreate;
