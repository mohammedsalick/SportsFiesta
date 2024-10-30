import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnimatedAd from './AnimatedAd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AnimatedHeading from './AnimatedHeading';

// Add this helper function at the top of your component
const sortAndFilterEvents = (events, limit = 3) => {
    return events
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
        .filter(event => new Date(event.date) >= new Date()) // Filter future events
        .slice(0, limit); // Take only the first 'limit' events
};

const Home = () => {
    const [events, setEvents] = useState([]);
    const [latestEventLeaderboard, setLatestEventLeaderboard] = useState([]);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsResponse = await API.get('/events');
                setEvents(eventsResponse.data);

                if (eventsResponse.data.length > 0) {
                    const latestEvent = eventsResponse.data[0]; // Assuming events are sorted by date
                    const leaderboardResponse = await API.get(`/scores/leaderboard/${latestEvent._id}`);
                    setLatestEventLeaderboard(leaderboardResponse.data);
                }
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    // Custom arrow components
    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: "10px" }}
                onClick={onClick}
            />
        );
    };

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: "10px" }}
                onClick={onClick}
            />
        );
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        cssEase: "linear",
        pauseOnHover: true,
        arrows: false, // Remove arrows
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const SponsorAd = ({ imageUrl, link }) => (
        <div className="px-2">
            <motion.a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.img 
                    src={imageUrl} 
                    alt="Sponsor Ad" 
                    className="w-full h-32 object-contain rounded-lg shadow-md p-4 bg-white"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x150?text=Sponsor";
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                />
            </motion.a>
        </div>
    );

    const sponsorAds = [
        { 
            imageUrl: "https://logo.clearbit.com/colgate.com", 
            link: "https://www.colgate.com" 
        },
        { 
            imageUrl: "https://logo.clearbit.com/asianpaints.com", 
            link: "https://www.asianpaints.com" 
        },
        { 
            imageUrl: "https://logo.clearbit.com/nike.com", 
            link: "https://www.nike.com" 
        },
        { 
            imageUrl: "https://logo.clearbit.com/adidas.com", 
            link: "https://www.adidas.com" 
        },
        { 
            imageUrl: "https://logo.clearbit.com/pepsi.com", 
            link: "https://www.pepsi.com" 
        },
        { 
            imageUrl: "https://logo.clearbit.com/coca-cola.com", 
            link: "https://www.coca-cola.com" 
        },
    ];

    const BeautifulBarGraph = ({ data, eventName }) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

        return (
            <motion.div 
                className="mt-8 bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h4 
                    className="text-2xl font-semibold mb-4 text-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Latest Event Leaderboard: {eventName}
                </motion.h4>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="teamName" 
                            angle={-45} 
                            textAnchor="end" 
                            interval={0} 
                            height={70} 
                            tick={{ fill: '#666', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                            cursor={{ fill: 'rgba(180, 180, 180, 0.2)' }}
                        />
                        <Bar 
                            dataKey="totalPoints" 
                            fill="#8884d8" 
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        );
    };

    return (
        <div className="bg-gradient-to-b from-purple-100 to-indigo-200 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Unified Box for Heading and Sponsors */}
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                             border border-white/20 p-6 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated Heading */}
                    <AnimatedHeading />
                    
                    {/* Sponsors Section */}
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <motion.h3 
                            className="text-2xl font-bold mb-6 text-indigo-800 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Our Sponsors
                        </motion.h3>
                        <div className="bg-white/50 rounded-xl p-4">
                            <Slider {...sliderSettings}>
                                {sponsorAds.map((ad, index) => (
                                    <SponsorAd 
                                        key={index} 
                                        imageUrl={ad.imageUrl} 
                                        link={ad.link} 
                                    />
                                ))}
                            </Slider>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Animated Ad Component */}
                <AnimatedAd/>
                
                {/* Latest Event Leaderboard Section */}
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                             border border-white/20 p-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {latestEventLeaderboard.length > 0 && events.length > 0 ? (
                        <BeautifulBarGraph 
                            data={latestEventLeaderboard} 
                            eventName={events[0].title} 
                        />
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No leaderboard data available for the latest event.
                        </p>
                    )}
                </motion.div>

                {/* Upcoming Events Section */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                             border border-white/20 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <motion.h2 
                            className="text-3xl font-bold text-indigo-800"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Upcoming Events
                        </motion.h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                                     hover:bg-indigo-700 transition-colors duration-300"
                            onClick={() => navigate('/events')}
                        >
                            View All Events
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortAndFilterEvents(events, 3).map((event, index) => (
                            <motion.div 
                                key={event._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 * index }}
                                whileHover={{ 
                                    y: -5,
                                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                {/* Event Header */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
                                    <h3 className="font-bold text-xl truncate">{event.title}</h3>
                                    <p className="text-sm text-indigo-100 mt-1">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Event Content */}
                                <div className="p-6 space-y-4">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                                            {event.category}
                                        </span>
                                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                            {event.maxRegistrations} slots
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {event.description}
                                    </p>

                                    {/* Action Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                                                 text-white py-2 px-4 rounded-lg font-medium
                                                 hover:from-indigo-700 hover:to-purple-700 
                                                 transition-all duration-300 shadow-md"
                                        onClick={() => navigate(`/event/${event._id}`)}
                                    >
                                        View Details
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* No Events Message */}
                    {events.length === 0 && (
                        <motion.div 
                            className="text-center py-12 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <p className="text-xl">No upcoming events at the moment.</p>
                            <p className="mt-2">Check back later for new events!</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
