import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingForm({ onBook }) {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/routes');
        setRoutes(response.data);
        if (response.data.length > 0) setSelectedRoute(response.data[0]._id);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ routeId: selectedRoute, date, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Your Ticket</h2>
      <div className="mb-4">
        <label className="block mb-2">Route</label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          {routes.map(route => (
            <option key={route._id} value={route._id}>
              {route.origin} to {route.destination} (₹{route.price})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Book Now
      </button>
    </form>
  );
}