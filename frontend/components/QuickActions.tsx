import React from "react";
import { CircleDollarSign, Shield, CircleDot, Layers } from "lucide-react";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  isHot?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, isHot }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="bg-gray-800 p-4 rounded-full">{icon}</div>
      {isHot && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Hot</span>
      )}
    </div>
    <span className="text-white mt-2 text-sm">{title}</span>
  </div>
);

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto mt-8">
      <ActionCard icon={<CircleDollarSign className="w-8 h-8 text-white" />} title="Dex Pro" isHot />
      <ActionCard icon={<Shield className="w-8 h-8 text-white" />} title="DEX Wave" isHot />
      <ActionCard icon={<CircleDot className="w-8 h-8 text-white" />} title="Staking" />
      <ActionCard icon={<Layers className="w-8 h-8 text-white" />} title="Dapps" />
    </div>
  );
};
