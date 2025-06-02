import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BookingForm({ onBook, loading }) {
  const [formData, setFormData] = useState({
    origin: 'Addis Ababa',
    destination: 'Bahir Dar', // Set default destination
    date: '',
    passengers: 1,
    paymentMethod: 'mobile_money'
  });
  const [routes, setRoutes] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Supported routes from the PDF
  const supportedRoutes = [
    { origin: 'Addis Ababa', destination: 'Bahir Dar', price: 500 },
    { origin: 'Addis Ababa', destination: 'Adama', price: 200 },
    { origin: 'Addis Ababa', destination: 'Jimma', price: 450 },
    { origin: 'Addis Ababa', destination: 'Dessie', price: 600 },
    { origin: 'Addis Ababa', destination: 'Dire Dawa', price: 800 }
  ];

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // First try to get routes from backend
        const response = await axios.get('http://localhost:5000/api/bookings/routes');
        
        // If no routes in backend, use the supportedRoutes as fallback
        const routesData = response.data.length > 0 ? response.data : supportedRoutes;
        setRoutes(routesData);
        
        // Initialize destinations based on default origin
        updateDestinations('Addis Ababa', routesData);
      } catch (error) {
        console.error('Error fetching routes:', error);
        // If API fails, use the supportedRoutes
        setRoutes(supportedRoutes);
        updateDestinations('Addis Ababa', supportedRoutes);
        toast.error('Failed to load routes from server. Using default routes.');
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    // Calculate total price whenever destination or passengers changes
    if (formData.destination) {
      const selectedDest = availableDestinations.find(d => d.city === formData.destination);
      if (selectedDest) {
        setTotalPrice(selectedDest.price * formData.passengers);
      }
    }
  }, [formData.destination, formData.passengers, availableDestinations]);

  const updateDestinations = (origin, allRoutes) => {
    const destinations = allRoutes
      .filter(route => route.origin === origin)
      .map(route => ({
        id: route._id || `${route.origin}-${route.destination}`, // Fallback ID if no _id
        city: route.destination,
        price: route.price
      }));
    
    setAvailableDestinations(destinations);
    
    // Set first destination as default if available
    const defaultDestination = destinations[0]?.city || '';
    setFormData(prev => ({
      ...prev,
      destination: defaultDestination,
      origin
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'origin') {
      updateDestinations(value, routes);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast.error('Please select a travel date');
      return;
    }

    const selectedRoute = routes.find(route => 
      route.origin === formData.origin && 
      route.destination === formData.destination
    );

    if (!selectedRoute) {
      toast.error('Please select a valid route');
      return;
    }

    const bookingData = {
      routeId: selectedRoute._id || `${selectedRoute.origin}-${selectedRoute.destination}`,
      date: formData.date,
      passengers: formData.passengers,
      paymentMethod: formData.paymentMethod,
      price: totalPrice
    };

    onBook(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">From</label>
          <select
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Addis Ababa">Addis Ababa</option>
            {/* Only Addis Ababa as origin as per PDF requirements */}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">To</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {availableDestinations.map(dest => (
              <option key={`dest-${dest.id}`} value={dest.city}>
                {dest.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Travel Date</label>
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Passengers</label>
          <input
            type="number"
            name="passengers"
            min="1"
            max="10"
            value={formData.passengers}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Total Price</label>
          <div className="p-3 bg-gray-100 rounded-lg font-medium">
            {totalPrice} ETB
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-3">Payment Method</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['mobile_money', 'bank_transfer', 'card'].map(method => (
            <label 
              key={method} 
              className={`p-4 border rounded-lg cursor-pointer transition ${formData.paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.paymentMethod === method ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                  {formData.paymentMethod === method && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="capitalize">{method.replace('_', ' ')}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Confirm Booking'}
      </button>
    </form>
  );
}