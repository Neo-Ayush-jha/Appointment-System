import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Book Appointments
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with professional doctors, barbers, and service providers. 
            Schedule appointments effortlessly and manage your bookings all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
                >
                  Start Booking Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;