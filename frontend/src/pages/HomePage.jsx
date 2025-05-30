import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/routes');
        // Get top 3 routes (simplified - in production you'd track actual popularity)
        setPopularRoutes(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to E-Bus Tickets</h1>
        <p className="text-lg text-gray-600 mb-8">
          Book your bus tickets online in just a few clicks
        </p>
        <Link
          to="/book"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Book Your Ticket Now
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Popular Routes</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
              <div key={route._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">
                  {route.origin} → {route.destination}
                </h3>
                <p className="text-gray-600 mb-2">Price: ₹{route.price}</p>
                <Link
                  to={`/book`}
                  state={{ routeId: route._id }}
                  className="inline-block mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded transition"
                >
                  Book This Route
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔍', title: 'Search', text: 'Find your perfect bus route' },
            { icon: '🎫', title: 'Book', text: 'Select seats and make payment' },
            { icon: '🚌', title: 'Travel', text: 'Board with your e-ticket' },
          ].map((step, index) => (
            <div key={index} className="text-center p-4">
              <span className="text-4xl mb-3 inline-block">{step.icon}</span>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}