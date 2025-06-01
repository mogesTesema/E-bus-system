import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ethiopianBus from '../assets/ethiopian-bus.jpg';
import busSeats from '../assets/bus-seats.jpg';
import confirmationBg from '../assets/confirmation-bg.jpg';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('book');
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    routeId: '',
    date: '',
    passengers: 1,
    paymentMethod: 'mobile_money'
  });

  // Fetch user data and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userId');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user data
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        // Fetch user bookings
        const bookingsRes = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);

        // Fetch available routes
        const routesRes = await axios.get('http://localhost:5000/api/routes');
        setRoutes(routesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings([...bookings, response.data]);
      toast.success('Booking confirmed successfully!');
      setActiveTab('my-tickets');
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
    toast.info('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header with User Info */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome back, {user?.name}</h1>
                <p className="text-blue-200">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-inner mb-8">
          <button
            className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'book' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => navigate('/book')}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
              <span>Book Ticket</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'my-tickets' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('my-tickets')}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
              <span>My Tickets</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {activeTab === 'book' ? (
            <div className="md:flex">
              {/* Booking Form Section */}
              {/* <div className="md:w-1/3 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Journey</h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Select Route</label>
                    <select
                      name="routeId"
                      value={formData.routeId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Select a route --</option>
                      {routes.map(route => (
                        <option key={route._id} value={route._id}>
                          {route.origin} → {route.destination} - {route.price} ETB
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Travel Date</label>
                      <input
                        type="date"
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Passengers</label>
                      <input
                        type="number"
                        name="passengers"
                        min="1"
                        max="10"
                        value={formData.passengers}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Payment Method</label>
                    <div className="space-y-3">
                      {['mobile_money', 'bank_transfer', 'card'].map(method => (
                        <label key={method} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formData.paymentMethod === method}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-blue-600"
                          />
                          <span className="capitalize">{method.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 transition shadow-lg font-bold"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div> */}

              {/* Visual Section */}
              <div className="hidden md:block md:w-full bg-blue-50 relative">
                <img 
                  src={ethiopianBus} 
                  alt="Ethiopian Bus" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Travel Across Ethiopia</h3>
                  <p className="text-blue-100">Safe, comfortable and affordable bus travel</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tickets</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <img 
                    src={busSeats} 
                    alt="Empty bus seats" 
                    className="mx-auto w-48 h-48 object-contain opacity-50 mb-6"
                  />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No tickets booked yet</h3>
                  <p className="text-gray-500 mb-4">Your upcoming journeys will appear here</p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Book Your First Ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map(booking => (
                    <div key={booking._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                      <div className="md:flex">
                        <div className="md:w-1/4 bg-blue-600 p-6 text-white flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{new Date(booking.date).getDate()}</div>
                            <div className="text-sm uppercase">
                              {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>
                        </div>
                        <div className="md:w-2/4 p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {booking.origin} → {booking.destination}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>Departure: {new Date(booking.date).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center space-x-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              <span>{booking.passengers} passenger(s)</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                              </svg>
                              <span>{booking.totalPrice} ETB</span>
                            </span>
                          </div>
                        </div>
                        <div className="md:w-1/4 bg-gray-50 p-6 flex items-center justify-center">
                          <div className="text-center">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                              Confirmed
                            </span>
                            <button
                              onClick={() => {
                                // Implement view ticket details
                                toast.info('Ticket details would open here');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} E-Bus Ticket System. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="#" className="hover:text-blue-300">Terms</Link>
            <Link to="#" className="hover:text-blue-300">Privacy</Link>
            <Link to="#" className="hover:text-blue-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;