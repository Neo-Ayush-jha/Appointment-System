import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">BookingApp</h3>
            <p className="text-gray-300 mb-4">
              The most trusted platform for booking professional appointments.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/signup" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Professionals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Professionals</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/signup" className="hover:text-white transition-colors">Join as Professional</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Manage Schedule</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Business Tools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">support@bookingapp.com</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">123 Business St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BookingApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;