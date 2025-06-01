import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Navbar from './components/Navbar.jsx';
import TicketDisplay from './components/TicketDisplay.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route Path="/ticket" element={<TicketDisplay/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;