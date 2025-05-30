import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function TicketDisplay() {
  const { state } = useLocation();
  const ticket = state?.ticket;

  // Common Ethiopian bus routes
  const ethiopianRoutes = {
    'AA-DB': { origin: 'Addis Ababa', destination: 'Debre Birhan', duration: '3 hours' },
    'AA-BD': { origin: 'Addis Ababa', destination: 'Bahir Dar', duration: '10 hours' },
    'AA-GO': { origin: 'Addis Ababa', destination: 'Gonder', duration: '12 hours' },
    'AA-MK': { origin: 'Addis Ababa', destination: 'Mekelle', duration: '14 hours' },
    'AA-AW': { origin: 'Addis Ababa', destination: 'Awassa', duration: '5 hours' },
    'AA-DS': { origin: 'Addis Ababa', destination: 'Dire Dawa', duration: '9 hours' },
  };

  // Get route details
  const routeDetails = ticket?.routeId ? ethiopianRoutes[ticket.routeId] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-green-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">E-Bus Ticket</h2>
              <span className="bg-yellow-500 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                Confirmed
              </span>
            </div>
            <p className="text-green-200 mt-1">Thank you for traveling with us</p>
          </div>

          {/* Ticket Body */}
          <div className="p-6">
            {ticket ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Journey Details</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">From:</span> {routeDetails?.origin || 'Addis Ababa'}
                      </p>
                      <p>
                        <span className="font-medium">To:</span> {routeDetails?.destination || 'Unknown'}
                      </p>
                      <p>
                        <span className="font-medium">Travel Date:</span> {dayjs(ticket.date).format('MMMM D, YYYY')}
                      </p>
                      <p>
                        <span className="font-medium">Departure Time:</span> 5:00 AM (Local Time)
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span> {routeDetails?.duration || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Passenger Details</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span> {ticket.passengerName || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-medium">Tickets:</span> {ticket.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Seat Numbers:</span> {ticket.seats?.join(', ') || 'Will be assigned at station'}
                      </p>
                      <p>
                        <span className="font-medium">Booking Reference:</span> {ticket._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Fare:</span>
                    <span className="text-2xl font-bold text-green-800">
                      {ticket.totalPrice ? `${ticket.totalPrice} ETB` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please arrive at the bus station at least 1 hour before departure with your ID.
                        Printed or mobile tickets accepted.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700">No ticket information found</h3>
                <p className="mt-2 text-gray-500">
                  Please complete your booking to view your ticket
                </p>
                <Link
                  to="/book"
                  className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Ticket Footer */}
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <p>For assistance, call +251 911 234 567</p>
              <p>© {new Date().getFullYear()} E-Bus Ethiopia</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Print Ticket
            <svg className="ml-2 -mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}