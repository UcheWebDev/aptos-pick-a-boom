import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleUserRound,
  Text,
  BookText,
  Clock,
  Shield,
  ArrowUpRight,
  Trophy,
  TrendingUp,
  Target,
  Activity,
  Coins,
} from "lucide-react";
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
  const winningAmount = formatStakeAmount(parseFloat(stake.amount) * 2);

  return (
    <div className="bg-white w-80 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-blue-100">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-50 p-2 rounded-lg">
              <BookText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                {formatAddress(stake.creator)}
              </span>
              {/* <span className="text-xs text-gray-500">Created 2h ago</span> */}
            </div>
          </div>
          <div>
            <span
              className={`
                text-xs px-3 py-1.5 rounded-full font-medium
                ${
                  isCompleted
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isOpen
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                }
              `}
            >
              {getStakeStatus(stake.status)}
            </span>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-3xl font-bold text-gray-800">{formatStakeAmount(stake.amount)}</span>
            <span className="text-base font-semibold text-gray-500">APT</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 ">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">2x</span>
            <span className="text-gray-400">|</span>
            <span className="text-xs">F. Win. {winningAmount} APT</span>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Lock Period</span>
            <span className="text-sm font-medium text-gray-700">90 Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Validators</span>
            <span className="text-sm font-medium text-gray-700">3 Active</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Min. Stake</span>
            <span className="text-sm font-medium text-gray-700">100 APT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total Stakers</span>
            <span className="text-sm font-medium text-gray-700">127</span>
          </div>
        </div> */}

        {/* Action Button */}
        {/* <button
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200
            ${isOpen ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
          disabled={!isOpen}
        >
          {isOpen ? "Pair" : "Closed"}
        </button> */}
      </div>
    </div>
  );
};

const StakerCard = ({ staker }) => {
  return (
    <div className="bg-white w-80 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-purple-100">
      <div className="p-5">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-purple-50 p-2 rounded-lg ring-1 ring-purple-100">
              <CircleUserRound className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 hover:text-purple-600 cursor-pointer transition-colors">
                {formatAddress(staker.address)}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group">
              <div className="flex items-center gap-1.5">
                {/* <Trophy className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-600" /> */}
                <span className="text-xs font-medium text-gray-700">{staker.stakeCount} Stakes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Total Staked</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                {Number(staker.totalStaked).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-semibold text-gray-600">APT</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium text-green-600">+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Success ======</span>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">92%</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Avg. Lock Time</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">60 Days</span>
              </div>
            </div>
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
