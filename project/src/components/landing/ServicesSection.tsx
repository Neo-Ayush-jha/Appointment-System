import React from 'react';
import { UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Medical Consultations',
      description: 'Book appointments with qualified doctors and specialists',
      color: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-600',
      features: ['General Practice', 'Specialist Consultations', 'Health Checkups'],
    },
    {
      title: 'Grooming Services',
      description: 'Professional barber and styling services',
      color: 'from-green-50 to-green-100',
      iconBg: 'bg-green-600',
      features: ['Haircuts & Styling', 'Beard Trimming', 'Hair Treatments'],
    },
    {
      title: 'More Services',
      description: 'Expanding to include more professional services',
      color: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-600',
      features: ['Beauty Services', 'Wellness Coaching', 'And Many More...'],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Services
          </h2>
          <p className="text-xl text-gray-600">
            Book appointments for various professional services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className={`bg-gradient-to-br ${service.color} p-6 rounded-xl`}>
              <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;