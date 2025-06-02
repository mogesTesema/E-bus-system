import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BookingForm({ onBook, loading }) {
  const [formData, setFormData] = useState({
    origin: 'Addis Ababa', 
    destination: '', 
    date: '',
    quantity: 1, 
    paymentMethod: 'mobile_money'
  });
  const [routes, setRoutes] = useState([]);
  
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const supportedCities = ['Addis Ababa']; 
  const supportedDestinations = ['Bahir Dar', 'Adama', 'Jimma', 'Dessie', 'Dire Dawa']; 

  
  const manualSupportedRoutes = [
    { origin: 'Addis Ababa', destination: 'Bahir Dar', price: 500 },
    { origin: 'Addis Ababa', destination: 'Adama', price: 200 },
    { origin: 'Addis Ababa', destination: 'Jimma', price: 450 }, 
    { origin: 'Addis Ababa', destination: 'Dessie', price: 600 },
    { origin: 'Addis Ababa', destination: 'Dire Dawa', price: 800 } 
    
  ];

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/routes');

        
        const routesData = response.data.length > 0 ? response.data : manualSupportedRoutes;
        setRoutes(routesData);

       
        updateDestinations(formData.origin, routesData);

      } catch (error) {
        console.error('Error fetching routes:', error);
       
        setRoutes(manualSupportedRoutes);
        updateDestinations(formData.origin, manualSupportedRoutes);
        toast.error('Failed to load routes from server. Using default routes (booking may not work).');
      }
    };
    fetchRoutes();
  }, []); 

  useEffect(() => {
   
    if (formData.destination && availableDestinations.length > 0) {
      const selectedDest = availableDestinations.find(d => d.city === formData.destination);
      if (selectedDest) {
        setTotalPrice(selectedDest.price * formData.quantity); 
      } else {
        setTotalPrice(0); 
      }
    } else {
      setTotalPrice(0); 
    }
  }, [formData.destination, formData.quantity, availableDestinations]); 

  const updateDestinations = (origin, allRoutes) => {
    
    const destinations = allRoutes
      .filter(route => route.origin === origin && route.destination !== origin)
      .map(route => ({
       
        id: route._id, 
        city: route.destination,
        price: route.price
      }));

    setAvailableDestinations(destinations);

   
    const newDestination = destinations.length > 0 ? destinations[0].city : '';

    setFormData(prev => ({
      ...prev,
      origin: origin,
      destination: newDestination
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
    if (!formData.origin || !formData.destination) {
      toast.error('Please select both origin and destination.');
      return;
    }
    if (formData.origin === formData.destination) {
        toast.error('Origin and Destination cannot be the same.');
        return;
    }

    const selectedRoute = routes.find(route =>
      route.origin === formData.origin &&
      route.destination === formData.destination
    );

    if (!selectedRoute) {
      toast.error('The selected route is not available. Please choose a valid combination.');
      return;
    }

    
    if (!selectedRoute._id) {
        toast.error('Cannot book this route: Route ID not found. Please select a route fetched from the server.');
        return;
    }

    const bookingData = {
      userId: localStorage.getItem('userId'), 
      routeId: selectedRoute._id, 
      date: formData.date,
      quantity: formData.quantity, 
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
         
            {supportedCities.map(city => (
              <option key={`origin-${city}`} value={city}>
                {city}
              </option>
            ))}
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
            
            disabled={!formData.origin || availableDestinations.length === 0}
          >
           
            {availableDestinations.length === 0 ? (
              <option value="">No destinations from {formData.origin}</option>
            ) : (
              
              availableDestinations.map(dest => (
                <option key={`dest-${dest.id}`} value={dest.city}>
                  {dest.city} - {dest.price} ETB
                </option>
              ))
            )}
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
          <label className="block text-gray-700 font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity" 
            min="1"
            max="10"
            value={formData.quantity} 
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