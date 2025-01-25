import React, { useMemo, useState } from "react";
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
  Flame,
  Plus,
  Lock,
  CircleUser,
  ArrowRight,
  Gem,
  Timer,
  ChevronRight,
  Award,
  Rocket,
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
  <div className="bg-gray-800 w-72 p-6 border rounded-lg border-gray-700 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-700 rounded-lg w-12 h-12"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 h-4 bg-gray-700 rounded w-1/3"></div>
  </div>
);

const StakeCard = ({ stake }) => {
  const stakeStatus = getStakeStatus(stake.status);
  const isOpen = stakeStatus === "Open";
  const isCompleted = stakeStatus === "Completed";
  const winningAmount = formatStakeAmount(parseFloat(stake.stake_amount) * 2);

  return (
    <div className="relative group">
      {/* Animated border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

      <div className="relative bg-gray-900 rounded-2xl p-6 border border-amber-500/20 backdrop-blur-xl">
        {/* Decorative circuit lines */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-md rounded-lg"></div>
              <div className="relative bg-gray-900 p-3 rounded-lg border border-amber-500">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mr-4">
              Stake Details
            </h3>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/20 blur-md rounded-full"></div>
            <div className="relative flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-pink-500/50">
              <span className="text-pink-400 font-bold">#</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-amber-500/20">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CircleUser className="w-4 h-4 text-amber-500" />
                <span className="text-amber-400/60">Address</span>
              </div>
              <span className="text-white font-mono">{formatAddress(stake.creator_addr)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-400/60">Total Matches</span>
              <span className="text-white font-mono">{stake.total_picks} MATCH(S)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-400/60">Total Stake</span>
              <span className="text-green-400 font-mono">{formatStakeAmount(stake.stake_amount)} APT</span>
            </div>
          </div>

          {isOpen ? (
            <button className="relative w-full mt-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur group-hover:blur-md transition-all"></div>
              <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium group-hover:bg-gray-900/50 transition-all flex items-center justify-center gap-2 border border-amber-500/20">
                <span className="group-hover:text-amber-400 transition-colors">Pair Now</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ) : (
            <div className="w-full bg-gray-800 text-gray-400 py-3 rounded-xl font-bold text-center mt-6 border border-amber-500/20">
              {isCompleted ? "Completed" : "Closed"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StakerCard = ({ staker }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const handleViewInfoClick = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000); // Tooltip disappears after 2 seconds
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

      <div className="bg-gradient-to-br bg-gray-900 rounded-xl p-6 border border-amber-500/20 transform transition-all duration-300">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-md rounded-lg"></div>
              <div className="relative bg-gray-900 p-3 rounded-lg border border-amber-500">
                <Rocket className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mr-4">
              Stake Details
            </h3>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/20 blur-md rounded-full"></div>
            <div className="relative flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-pink-500/50">
              <span className="text-pink-400 font-bold">#</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-amber-500/20">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CircleUser className="w-4 h-4 text-pink-500" />
                <span className="text-gray-400">Address</span>
              </div>
              <span className="text-white ml-8">{formatAddress(staker.address)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Wagers</span>
              <span className="text-white">{staker.stakeCount} WAGER (S)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Wager Valuations</span>
              <span className="text-green-400">{formatStakeAmount(staker.totalStakes)} APT</span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={handleViewInfoClick}
              className="w-full bg-gradient-to-r from-pink-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>View Info</span>
            </button>

            {showTooltip && (
              <div className="absolute top-full left-0 right-0 mt-2 z-10">
                <div className="bg-gray-700 text-white text-sm py-2 px-4 rounded-lg text-center shadow-lg">
                  Feature is coming soon !
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SwiperSection = ({ title, description, items, type = "stakes", isLoading }) => {
  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {/* <button className="text-cyan-400 flex items-center hover:text-cyan-300">
          View All <ArrowRight size={16} className="ml-2" />
        </button> */}
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
      return newStakes.filter((stake) => Number(formatStakeAmount(stake.stake_amount)) >= MIN_APT_AMOUNT).slice(0, 5);
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
