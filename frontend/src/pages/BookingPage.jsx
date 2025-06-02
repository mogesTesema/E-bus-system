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
      
      if (!token) {
        toast.error('Please login first');
        return navigate('/login');
      }

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Booking confirmed!');
      navigate('/dashboard/my-tickets', { 
        state: { newBooking: response.data } 
      });
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
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