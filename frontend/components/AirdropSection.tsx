import React from "react";

interface AirdropCardProps {
  tag: string;
  title: string;
  imageSrc: string;
}

const AirdropCard: React.FC<AirdropCardProps> = ({ tag, title, imageSrc }) => (
  <div className="bg-gray-800/50 rounded-xl p-4 flex gap-4">
    <img src={imageSrc} alt={title} className="w-24 h-24 rounded-lg object-cover" />
    <div className="flex flex-col justify-center">
      <span className="text-green-400 text-sm">#{tag}</span>
      <h3 className="text-white text-xl mt-1">{title}</h3>
    </div>
  </div>
);

export const AirdropSection = () => {
  return (
    <div className="mt-12 px-4">
      <h2 className="text-white text-3xl font-bold mb-6">Discover Web3 Gains</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AirdropCard
          tag="AirDrop"
          title="Derive Airdrop Field"
          imageSrc="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200&h=200"
        />
        <AirdropCard
          tag="AirDrop"
          title="World Field"
          imageSrc="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200&h=200"
        />
      </div>
    </div>
  );
};
