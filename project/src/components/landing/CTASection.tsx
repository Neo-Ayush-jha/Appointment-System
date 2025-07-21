import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and professionals who trust BookingApp 
          for their appointment management needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;