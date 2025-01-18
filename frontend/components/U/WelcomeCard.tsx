import React from 'react';

interface WelcomeCardProps {
  name: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ name }) => {
  return (
    <div className="md:col-span-2 lg:col-span-3">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome Back, {name}!</h2>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;