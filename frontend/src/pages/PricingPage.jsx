// frontend/src/pages/PricingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: 29,
      duration: 'month',
      features: [
        'Access to 100+ courses',
        'Basic video quality',
        'Community support',
        'Certificate of completion',
        'Mobile access'
      ],
      notIncluded: [
        'Tutoring sessions',
        'Downloadable resources',
        'Priority support'
      ]
    },
    {
      name: 'Pro',
      price: 59,
      duration: 'month',
      featured: true,
      features: [
        'Access to 500+ courses',
        'HD video quality',
        'Priority support',
        'Certificate of completion',
        'Mobile access',
        '2 Tutoring sessions/month',
        'Downloadable resources'
      ]
    },
    {
      name: 'Enterprise',
      price: 99,
      duration: 'month',
      features: [
        'Unlimited course access',
        '4K video quality',
        '24/7 Priority support',
        'Certificate of completion',
        'Mobile access',
        '10 Tutoring sessions/month',
        'Downloadable resources',
        'Team analytics',
        'Custom learning paths'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-textPrimary mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Choose the plan that best fits your learning needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-cardBackground rounded-xl shadow-lg overflow-hidden ${
                plan.featured ? 'ring-2 ring-primary transform scale-105' : ''
              }`}
            >
              {plan.featured && (
                <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-textPrimary mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-textSecondary">/{plan.duration}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-textSecondary">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 opacity-50">
                      <span className="h-5 w-5 flex-shrink-0">✕</span>
                      <span className="text-textSecondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition duration-300 ${
                    plan.featured
                      ? 'bg-primary text-white hover:bg-blue-800'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-textSecondary">
            All plans come with a 30-day money-back guarantee. 
            <Link to="/contact" className="text-primary hover:underline ml-1">
              Contact us
            </Link>
            {' '}for custom enterprise solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
