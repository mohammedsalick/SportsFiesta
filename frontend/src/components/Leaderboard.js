import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { subscribeToScores, unsubscribeFromScores } from '../services/socket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Leaderboard = () => {
    const [events, setEvents] = useState([]);
    const [leaderboards, setLeaderboards] = useState({});
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        const fetchEventsAndLeaderboards = async () => {
            try {
                const eventsResponse = await API.get('/events');
                setEvents(eventsResponse.data);

                const leaderboardsData = {};
                for (const event of eventsResponse.data) {
                    const leaderboardResponse = await API.get(`/scores/leaderboard/${event._id}`);
                    leaderboardsData[event._id] = leaderboardResponse.data;
                }
                setLeaderboards(leaderboardsData);

                if (eventsResponse.data.length > 0) {
                    setActiveTab(eventsResponse.data[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchEventsAndLeaderboards();
    }, []);

    useEffect(() => {
        const handleScoreUpdate = (updatedLeaderboard) => {
            setLeaderboards(prevLeaderboards => ({
                ...prevLeaderboards,
                [updatedLeaderboard.eventId]: updatedLeaderboard.data
            }));
        };

        subscribeToScores(handleScoreUpdate);

        return () => {
            unsubscribeFromScores(handleScoreUpdate);
        };
    }, []);

    const LeaderboardTable = ({ data }) => (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-black   uppercase text-sm leading-normal">
                        <th className="py-4 px-6 text-left font-semibold">Rank</th>
                        <th className="py-4 px-6 text-left font-semibold">Team</th>
                        <th className="py-4 px-6 text-left font-semibold">Points</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {data.map((entry, index) => (
                        <tr key={entry.team || index} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                            <td className="py-4 px-6 text-left whitespace-nowrap">
                                <span className={`font-bold ${index < 3 ? 'text-2xl' : 'text-lg'} ${
                                    index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-gray-400' :
                                    index === 2 ? 'text-yellow-600' : 'text-blue-600'
                                }`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-left">
                                <div className="flex items-center">
                                    <div className="mr-3">
                                        <img className="w-8 h-8 rounded-full border-2 border-gray-200" src={`https://ui-avatars.com/api/?name=${entry.teamName}&background=random`} alt={entry.teamName} />
                                    </div>
                                    <span className="font-medium">{entry.teamName}</span>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-left font-bold text-gray-800">{entry.totalPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const BeautifulBarGraph = ({ data }) => {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

        return (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">Score Distribution</h4>
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
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Leaderboards</h2>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {events.map(event => (
                        <button
                            key={event._id}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                                activeTab === event._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveTab(event._id)}
                        >
                            {event.title}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab && leaderboards[activeTab] && (
                <div>
                    <h3 className="text-2xl font-bold mb-4">{events.find(e => e._id === activeTab)?.title}</h3>
                    <LeaderboardTable data={leaderboards[activeTab]} />
                    <BeautifulBarGraph data={leaderboards[activeTab]} />
                </div>
            )}

            {(!activeTab || !leaderboards[activeTab]) && (
                <p className="text-center text-gray-500 mt-8">No leaderboard data available.</p>
            )}
        </div>
    );
};

export default Leaderboard;
