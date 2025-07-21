import React from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Customer',
      content: 'This platform has made booking appointments so much easier. I love the real-time availability feature!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Doctor',
      content: 'Managing my patient appointments has never been this simple. The interface is intuitive and efficient.',
      rating: 5,
    },
    {
      name: 'Alex Rodriguez',
      role: 'Barber',
      content: 'I can focus on my craft while the platform handles all my bookings. Highly recommended!',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Don't just take our word for it
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;