import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import CertificatePreview from './CertificatePreview';

const logoImage = require('../assets/images/logo.png');

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative px-4 py-2 text-lg font-medium ${
        isActive(to)
          ? 'text-yellow-400'
          : 'text-white hover:text-yellow-400'
      } transition duration-300`}
    >
      {children}
      {isActive(to) && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
          layoutId="underline"
          initial={false}
        />
      )}
    </Link>
  );

  const StyledCertificatePreview = () => (
    <CertificatePreview
      participantName={user?.name || 'Participant'}
      eventName="SportsFiesta 2023"
    >
      {({ openPreview }) => (
        <button
          onClick={openPreview}
          className="relative px-4 py-2 text-lg font-medium text-white hover:text-yellow-400 transition duration-300"
        >
          Preview Certificate
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 opacity-0 hover:opacity-100"
            initial={false}
            transition={{ duration: 0.3 }}
          />
        </button>
      )}
    </CertificatePreview>
  );

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src={require('../assets/images/logo.png')} 
                alt="SportsFiesta Logo" 
                className="w-10 h-10 mr-2 rounded-full" 
              />
              <span className="text-white font-bold text-2xl">SportsFiesta</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              {user && (
                <>
                  {user.role === 'admin' && <NavLink to="/create-event">Create Event</NavLink>}
                  {user.role === 'participant' && <NavLink to="/register-team">Register Team</NavLink>}
                  {user.role === 'judge' && <NavLink to="/submit-score">Submit Score</NavLink>}
                  <StyledCertificatePreview />
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-lg font-medium text-white hover:text-yellow-400 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            {!user && (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          {user && (
            <>
              {user.role === 'admin' && <NavLink to="/create-event">Create Event</NavLink>}
              {user.role === 'participant' && <NavLink to="/register-team">Register Team</NavLink>}
              {user.role === 'judge' && <NavLink to="/submit-score">Submit Score</NavLink>}
              <StyledCertificatePreview />
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-indigo-800">
          {user ? (
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-800">
                  <span className="text-xl font-medium leading-none text-white">{user.name ? user.name[0].toUpperCase() : '?'}</span>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name || 'User'}</div>
                <div className="text-sm font-medium leading-none text-indigo-200">{user.email || 'No email'}</div>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex-shrink-0 bg-indigo-800 p-1 rounded-full text-indigo-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
              >
                <span className="sr-only">Logout</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400 hover:bg-indigo-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-400 hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;
