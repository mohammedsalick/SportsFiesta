
# SportsFiesta 🏆

SportsFiesta is a comprehensive web application for managing corporate sports tournaments and events. It provides a platform for organizing events, managing team registrations, scoring, and real-time leaderboards.

## Features ✨

- **User Authentication & Authorization**
  - Multiple user roles (Admin, Judge, Participant)
  - Secure JWT-based authentication
  - Role-based access control

- **Event Management**
  - Create and manage sports events
  - Categorize events (Indoor, Outdoor, Fun)
  - Set event capacity and registration limits
  - Rich event details with images and descriptions

- **Team Registration**
  - Easy team registration process
  - Real-time registration status
  - Team management dashboard

- **Scoring System**
  - Real-time score submission
  - Judge-specific scoring interface
  - Automated leaderboard updates

- **Live Leaderboards**
  - Real-time leaderboard updates using Socket.io
  - Beautiful data visualization with charts
  - Event-specific rankings

- **AI-Powered Event Suggestions**
  - Gemini AI integration for event ideas
  - Smart event recommendations
  - Automated event detail generation

## Technology Stack 🛠

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Socket.io Client
- Chart.js
- Google Generative AI

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- PDFKit

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/aathifpm/sports-fiesta.git
```

2. Install Frontend Dependencies
```bash
cd client
npm install
```

3. Install Backend Dependencies
```bash
cd server
npm install
```

4. Environment Setup
Create `.env` files in both frontend and backend directories:

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

Backend `.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the Development Servers

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm start
```

## API Documentation 📚

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Event Endpoints
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (Admin only)
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Team Endpoints
- `POST /api/teams` - Register team
- `GET /api/teams` - Get teams for an event

### Score Endpoints
- `POST /api/scores` - Submit score (Judge only)
- `GET /api/scores/:eventId` - Get event scores
- `GET /api/scores/leaderboard/:eventId` - Get event leaderboard

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


![image](https://github.com/user-attachments/assets/fb010ce4-58f0-4c68-ba3c-e11348c13d2f)

![image](https://github.com/user-attachments/assets/ee1dff3a-4627-49ac-bf6d-4687cc29b69c)

![image](https://github.com/user-attachments/assets/0b76e664-cc78-497c-97b0-b49dfe0d237b)

![image](https://github.com/user-attachments/assets/e5d2911e-2fce-4990-855b-934a6a533cde)

![image](https://github.com/user-attachments/assets/4e1fbb8d-9955-41cf-ac82-94d075a95fec)



![image](https://github.com/user-attachments/assets/be644e0b-dbd7-499b-8b30-e86b5f6534c4)

