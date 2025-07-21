import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Professionals' },
    { number: '50,000+', label: 'Appointments Booked' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;