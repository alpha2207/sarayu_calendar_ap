import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login';
import EventForm from './EventsPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define the route for the login page */}
          <Route path="/" element={<EventForm />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Define the route for the event form page (after login) */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
