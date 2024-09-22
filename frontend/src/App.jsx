import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login';
import EventForm from './EventsPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<EventForm />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
