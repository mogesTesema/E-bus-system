import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm.jsx';

export default function BookingPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  const handleBook = async (bookingData) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please login first');
        return navigate('/login');
      }
      
      const response = await axios.post('http://localhost:5000/api/bookings/book', {
        ...bookingData,
        userId
      });
      setBooking(response.data);
      navigate('/confirm');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div>
      <BookingForm onBook={handleBook} />
    </div>
  );
}