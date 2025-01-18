import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatStakeAmount } from "@/utils/stakeUtils";

const formatAddress = (address) => {
  if (!address) return "";
  // Show even shorter version on mobile
  if (window.innerWidth < 640) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 2)}`;
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const SkeletonLoader = () => (
  <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-full space-x-4 sm:space-x-8">
          {/* Creator Skeleton */}
          <div className="flex items-center">
            <div className="text-center">
              <div className="h-8 sm:h-10 w-24 sm:w-32 bg-blue-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 sm:h-5 w-16 sm:w-20 bg-blue-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* VS Text Skeleton */}
          <div className="h-8 sm:h-10 w-12 bg-blue-700 rounded animate-pulse"></div>

          {/* Pairer Skeleton */}
          <div className="flex items-center">
            <div className="text-center">
              <div className="h-8 sm:h-10 w-24 sm:w-32 bg-blue-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 sm:h-5 w-16 sm:w-20 bg-blue-700 rounded animate-pulse"></div>
            </div>
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

const MicroBettingBanner = ({ stakes = [] }) => {
  const [stake, setStake] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomStake = async () => {
      try {
        const { data, error } = await supabase
          .from("stakes")
          .select("*")
          .not("pairer_addr", "is", null)
          .limit(1)
          .single();

        if (error) throw error;
        setStake(data);
      } catch (error) {
        console.error("Error fetching stake:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomStake();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!stake) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="text-center">No paired stakes found</div>
      </div>
    );
  }

  const winningAmount = formatStakeAmount(parseFloat(stake.stake_amount) * 2);

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-full space-x-4 sm:space-x-8">
            {/* Creator */}
            <div className="flex items-center">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold">{formatAddress(stake.creator_addr)}</h2>
                <p className="text-blue-300 text-sm sm:text-base">Creator</p>
              </div>
            </div>

            {/* VS Text */}
            <div className="text-2xl sm:text-4xl font-bold">VS</div>

            {/* Pairer */}
            <div className="flex items-center">
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold">{formatAddress(stake.pairer_addr)}</h2>
                <p className="text-blue-300 text-sm sm:text-base">Pairer</p>
              </div>
            </div>
          </div>

          {/* Stake Info */}
          <div className="mt-4 flex flex-col items-center">
            <p className="text-lg sm:text-xl font-bold text-blue-300">Pot Win : {winningAmount} APT</p>
            <p className="text-xs sm:text-sm text-blue-300 mt-2">Pair • ID: #{stake.pair_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroBettingBanner;
