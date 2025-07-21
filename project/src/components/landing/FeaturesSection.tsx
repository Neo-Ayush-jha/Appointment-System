import React from 'react';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: CalendarIcon,
      title: 'Easy Booking',
      description: 'Book appointments with your favorite professionals in just a few clicks.',
    },
    {
      icon: ClockIcon,
      title: 'Real-time Scheduling',
      description: 'See available time slots in real-time and get instant confirmation.',
    },
    {
      icon: UserGroupIcon,
      title: 'Professional Network',
      description: 'Connect with verified doctors, barbers, and other service professionals.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose BookingApp?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've built the most comprehensive appointment booking platform 
            to serve both customers and professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;