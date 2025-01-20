import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUserRound, Text, BookText, Clock, Shield, ArrowUpRight, Trophy, TrendingUp } from "lucide-react";
import {
  parseStakeData,
  formatAddress,
  formatStakeAmount,
  getStakeStatus,
  calculateTopStakers,
} from "../utils/stakeUtils";
import { useToast } from "@/components/ui/use-toast";
import { useAptosPriceConverter } from "../hooks/useAptosPriceConverter";

// Loading skeleton for cards
const CardSkeleton = () => (
  <div className="bg-white w-72 p-4 shadow-md border rounded-lg animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded-full" />
    </div>
    <div className="mb-3">
      <div className="w-16 h-4 bg-gray-200 rounded mb-2" />
      <div className="flex items-center gap-2">
        <div className="w-20 h-8 bg-gray-200 rounded" />
        <div className="w-8 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const StakeCard = ({ stake }) => {
  const stakeStatus = getStakeStatus(stake.status);
  const isOpen = stakeStatus === "Open";
  const isCompleted = stakeStatus === "Completed";

  const { aptosToUsd, usdToAptos, loading: priceLoading, error: priceError } = useAptosPriceConverter();

  return (
    <div className="bg-white w-72 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <BookText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{formatAddress(stake.creator)}</span>
              <span className="text-xs text-gray-500">Creator</span>
            </div>
          </div>
          <div>
            <span
              className={`
      text-xs px-3 py-1 rounded-full font-medium
      ${
        isCompleted
          ? "bg-green-50 text-green-700 border border-green-200"
          : isOpen
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
      }
    `}
            >
              {getStakeStatus(stake.status)}
            </span>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-800">{formatStakeAmount(stake.amount)}</span>
            <span className="text-base font-semibold text-gray-600">APT</span>
            {/* {priceLoading ? (
              <span className="text-sm text-gray-500">Loading USD value...</span>
            ) : priceError ? (
              <span className="text-xs text-red-500">Unable to load USD value</span>
            ) : (
              <span className="text-sm text-gray-500">≈ ${aptosToUsd(parseInt(formatStakeAmount(stake.amount)))}</span>
            )}{" "} */}
          </div>
        </div>

        {/* Stats/Info */}
        {/* <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">24h limit</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Protected</span>
          </div>
        </div> */}

        {/* Action Button */}
        {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
          View Details
          <ArrowUpRight className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  );
};

const StakerCard = ({ staker }) => {
  return (
    <div className="bg-white w-72 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-50 p-1.5 rounded-lg">
              <CircleUserRound className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">{formatAddress(staker.address)}</span>
              <span className="text-xs text-gray-500">Active Staker</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Wager ({staker.stakeCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-800">{staker.totalStaked}</span>
            <span className="text-base font-semibold text-gray-600">APT</span>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs font-medium text-green-600">Total</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Win Rate</div>
            <div className="text-sm font-medium text-gray-700">{staker.winRate}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Avg. Stake</div>
            <div className="text-sm font-medium text-gray-700">{staker.averageStake} APT</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

const SwiperSection = ({ title, description, items, type = "stakes", isLoading }) => {
  return (
    <div className="w-full mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-600">{title}</h2>
        {/* <p className="text-gray-600">{description}</p> */}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-none">
                <CardSkeleton />
              </div>
            ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={type === "stakes" ? item.id : item.address} className="flex-none">
              {type === "stakes" ? <StakeCard stake={item} /> : <StakerCard staker={item} />}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-500 py-8">No {type} found</div>
        )}
      </div>
    </div>
  );
};

const StakeSwiper = ({ newStakes = [], activeStakes = [], isLoading = false, error = null }) => {
  const { toast } = useToast();
  const MIN_APT_AMOUNT = 1;

  // Show error toast when error prop changes
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Error handling for stake filtering
  const filteredStakes = useMemo(() => {
    try {
      return newStakes.filter((stake) => Number(formatStakeAmount(stake.amount)) >= MIN_APT_AMOUNT).slice(0, 5);
    } catch (err) {
      console.error("Error filtering Wager:", err);
      toast({
        title: "Error",
        description: "Failed to filter Wager. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  }, [newStakes, toast]);

  // Error handling for top stakers calculation
  const topStakers = useMemo(() => {
    return calculateTopStakers(newStakes, MIN_APT_AMOUNT);
  }, [newStakes, toast]);

  return (
    <div className="space-y-8">
      <SwiperSection
        title="Top Wagers"
        description="Top 5 wager amounts"
        type="stakes"
        items={filteredStakes}
        isLoading={isLoading}
      />
      <SwiperSection
        title="Top Stakers"
        type="stakers"
        description="Top 5 wager accounts"
        items={topStakers}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StakeSwiper;
