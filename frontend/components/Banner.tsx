import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formatAddress = (address) => {
  if (!address) return "";
  // Show even shorter version on mobile
  if (window.innerWidth < 640) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 2)}`;
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatStakeAmount = (amount) => {
  return amount.toFixed(2);
};

// Static data
const mockStake = {
  creator_addr: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  pairer_addr: "0x123d35Cc6634C0532925a3b844Bc454e4438f789",
  stake_amount: "1",
  pair_id: "123456",
  creator_avatar: "/api/placeholder/32/32", // Replace with actual avatar URL
  pairer_avatar: "/api/placeholder/32/32", // Replace with actual avatar URL
};

const SkeletonLoader = () => (
  <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-full space-x-4 sm:space-x-8">
          {/* Creator Skeleton */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-700 animate-pulse"></div>
            <div className="h-8 sm:h-10 w-24 sm:w-32 bg-blue-700 rounded animate-pulse"></div>
            <div className="h-4 sm:h-5 w-16 sm:w-20 bg-blue-700 rounded animate-pulse"></div>
          </div>

          {/* VS Text Skeleton */}
          <div className="h-8 sm:h-10 w-12 bg-blue-700 rounded animate-pulse"></div>

          {/* Pairer Skeleton */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-700 animate-pulse"></div>
            <div className="h-8 sm:h-10 w-24 sm:w-32 bg-blue-700 rounded animate-pulse"></div>
            <div className="h-4 sm:h-5 w-16 sm:w-20 bg-blue-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stake Info Skeleton */}
        <div className="mt-4 flex flex-col items-center">
          <div className="h-6 sm:h-7 w-32 sm:w-40 bg-blue-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-blue-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const MicroBettingBanner = () => {
  const winningAmount = 'stake + pair';

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-full space-x-4 sm:space-x-8">
            {/* Creator */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-10 w-10 border-2 border-blue-400">
                <AvatarImage src={mockStake.creator_avatar} alt="Creator" />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold">{formatAddress(mockStake.creator_addr)}</h2>
                <p className="text-blue-300 text-sm sm:text-base">Creator</p>
              </div>
            </div>

            {/* VS Text */}
            <div className="text-2xl sm:text-4xl font-bold">VS</div>

            {/* Pairer */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-10 w-10 border-2 border-blue-400">
                <AvatarImage src={mockStake.pairer_avatar} alt="Pairer" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold">{formatAddress(mockStake.pairer_addr)}</h2>
                <p className="text-blue-300 text-sm sm:text-base">Pairer</p>
              </div>
            </div>
          </div>

          {/* Stake Info */}
          <div className="mt-4 flex flex-col items-center">
            {/* <p className="text-lg sm:text-xl font-bold text-blue-300">Win : {winningAmount} </p> */}
            <p className="text-xs sm:text-sm text-blue-300 mt-2">Pair • ID: #{mockStake.pair_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroBettingBanner;
