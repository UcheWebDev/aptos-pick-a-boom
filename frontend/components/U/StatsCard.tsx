import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change }) => {
  return (
    <div className="rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium text-gray-100 swiper-title">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-100">{value}</p>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
    </div>
  );
};

export default StatsCard;
