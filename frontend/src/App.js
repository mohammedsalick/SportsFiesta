import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './components/Register';
import EventCreate from './components/EventCreate';
import EventList from './components/EventList';
import TeamRegistration from './components/TeamRegistration';
import ScoreSubmission from './components/ScoreSubmission';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './components/Home';
import EventDetails from './components/EventDetails';

const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  const { user } = React.useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Element {...rest} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute element={Home} />} />
            <Route path="/events" element={<ProtectedRoute element={EventList} />} />
            <Route path="/events/:id" element={<ProtectedRoute element={EventDetails} />} />
            <Route path="/create-event" element={<ProtectedRoute element={EventCreate} roles={['admin']} />} />
            <Route path="/register-team" element={<ProtectedRoute element={TeamRegistration} roles={['participant']} />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute element={AdminDashboard} roles={['admin']} />} />
            <Route path="/submit-score" element={<ProtectedRoute element={ScoreSubmission} roles={['judge']} />} />
            <Route path="/leaderboard" element={<ProtectedRoute element={Leaderboard} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
