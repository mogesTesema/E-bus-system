import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-blue-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">E-Bus Ticket System</h1>
          <p className="text-xl mb-8">Book your bus tickets across Ethiopia with ease</p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy Booking",
              description: "Simple and fast ticket booking process",
              icon: "⏱️"
            },
            {
              title: "Multiple Routes",
              description: "Covering all major Ethiopian cities",
              icon: "🗺️"
            },
            {
              title: "Secure Payments",
              description: "Safe and reliable payment options",
              icon: "🔒"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}