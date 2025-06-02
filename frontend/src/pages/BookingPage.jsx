import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingForm from '../components/BookingForm.jsx';

export default function BookingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBook = async (bookingData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId'); 
      if (!token || !userId) { 
        toast.error('Please login first to book a ticket.');
        return navigate('/login');
      }

      
      const bookingDataWithUser = { ...bookingData, userId: userId };

      const response = await axios.post(
        'http://localhost:5000/api/bookings/book', 
        bookingDataWithUser, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Booking confirmed!');
      navigate('/confirm', {
        state: { newBooking: response.data }
      });
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'Booking failed. Please try again.';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Booking service endpoint not found on server. Please check server status.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Bad request: Please check your booking details.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Book Your Bus Ticket</h1>
        <BookingForm onBook={handleBook} loading={loading} />
      </div>
    </div>
  );
}