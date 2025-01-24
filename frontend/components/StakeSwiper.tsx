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
  Flame,
  Plus,
  Lock,
  Users,
  ArrowRight,
  Award,
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
    // <div className="bg-white w-80 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-blue-100">
    //   <div className="p-5">
    //     <div className="flex items-center justify-between mb-4">
    //       <div className="flex items-center gap-2.5">
    //         <div className="bg-blue-50 p-2 rounded-lg">
    //           <BookText className="w-5 h-5 text-blue-600" />
    //         </div>
    //         <div className="flex flex-col">
    //           <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
    //             {formatAddress(stake.creator)}
    //           </span>
    //           <span className="text-xs text-gray-500">Created 2h ago</span>
    //         </div>
    //       </div>
    //       <div>
    //         <span
    //           className={`
    //             text-xs px-3 py-1.5 rounded-full font-medium
    //             ${
    //               isCompleted
    //                 ? "bg-green-50 text-green-700 border border-green-200"
    //                 : isOpen
    //                   ? "bg-blue-50 text-blue-700 border border-blue-200"
    //                   : "bg-red-50 text-red-700 border border-red-200"
    //             }
    //           `}
    //         >
    //           {getStakeStatus(stake.status)}
    //         </span>
    //       </div>
    //     </div>

    //     <div className="mb-6">
    //       <div className="flex items-baseline gap-2 mb-1.5">
    //         <span className="text-3xl font-bold text-gray-800">{formatStakeAmount(stake.amount)}</span>
    //         <span className="text-base font-semibold text-gray-500">APT</span>
    //       </div>
    //       <div className="flex items-center gap-2 text-sm text-gray-500 ">
    //         <TrendingUp className="w-4 h-4 text-green-500" />
    //         <span className="text-green-600 font-medium">2x</span>
    //         <span className="text-gray-400">|</span>
    //         <span className="text-xs">F. Win. {winningAmount} APT</span>
    //       </div>
    //     </div>

    //      <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100">
    //       <div className="flex flex-col">
    //         <span className="text-sm text-gray-500 mb-1">Lock Period</span>
    //         <span className="text-sm font-medium text-gray-700">90 Days</span>
    //       </div>
    //       <div className="flex flex-col">
    //         <span className="text-sm text-gray-500 mb-1">Validators</span>
    //         <span className="text-sm font-medium text-gray-700">3 Active</span>
    //       </div>
    //       <div className="flex flex-col">
    //         <span className="text-sm text-gray-500 mb-1">Min. Stake</span>
    //         <span className="text-sm font-medium text-gray-700">100 APT</span>
    //       </div>
    //       <div className="flex flex-col">
    //         <span className="text-sm text-gray-500 mb-1">Total Stakers</span>
    //         <span className="text-sm font-medium text-gray-700">127</span>
    //       </div>
    //     </div>

    //     <button
    //       className={`
    //         w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200
    //         ${isOpen ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
    //       `}
    //       disabled={!isOpen}
    //     >
    //       {isOpen ? "Pair" : "Closed"}
    //     </button>
    //   </div>
    // </div>
    <div className="">
      <div className="bg-gray-800 p-6 border border-gray-700 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">🔥</h3>
          <span className="text-cyan-400 font-bold">{stake.pair_id} </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between ">
            <span className="text-gray-400">Picks</span>
            <span className="text-white">{stake.total_picks}</span>
          </div>
          <div className="flex justify-between ">
            <span className="text-gray-400 mr-10"> Creator</span>
            <span className="text-white">{formatAddress(stake.creator_addr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wager Amount</span>
            <span className="text-green-400">{formatStakeAmount(stake.stake_amount)} APT</span>
          </div>
        </div>
        {/* <button className="w-full mt-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors">
          Stake More
        </button> */}
      </div>
    </div>
  );
};

const StakerCard = ({ staker }) => {
  return (
    // <div className="bg-white w-80 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-purple-100">
    //   <div className="p-5">
    //     <div className="flex items-center justify-between mb-4">
    //       <div className="flex items-center gap-2.5">
    //         <div className="bg-purple-50 p-2 rounded-lg ring-1 ring-purple-100">
    //           <CircleUserRound className="w-5 h-5 text-purple-600" />
    //         </div>
    //         <div className="flex flex-col">
    //           <span className="text-sm font-medium text-gray-800 hover:text-purple-600 cursor-pointer transition-colors">
    //             {formatAddress(staker.address)}
    //           </span>
    //         </div>
    //       </div>
    //       <div className="flex items-center">
    //         <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group">
    //           <div className="flex items-center gap-1.5">
    //             <span className="text-xs font-medium text-gray-700">{staker.stakeCount} Stakes</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
    //       <div className="flex flex-col gap-1.5">
    //         <span className="text-xs font-medium text-gray-500">Total Staked</span>
    //         <div className="flex items-baseline gap-2">
    //           <span className="text-2xl font-bold text-gray-800 tracking-tight">
    //             {Number(staker.totalStaked).toLocaleString(undefined, { maximumFractionDigits: 2 })}
    //           </span>
    //           <span className="text-sm font-semibold text-gray-600">APT</span>
    //           <div className="flex items-center gap-1.5 ml-auto">
    //             <TrendingUp className="w-3.5 h-3.5 text-green-500" />
    //             <span className="text-xs font-medium text-green-600">+12.5%</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div className="bg-gray-800 p-6 border border-gray-700  rounded-md hover:border-cyan-500 transition-colors">
        <div className="flex items-center gap-4 mb-4">
          <CircleUserRound className="w-12 h-12 text-cyan-600 rounded-full ring-2 ring-cyan-500/50" />
          {/* <img src={staker.avatar} alt="Staker Avatar" className="w-12 h-12 rounded-full ring-2 ring-cyan-500/50" /> */}
          <div>
            <h3 className="font-semibold text-white"> {formatAddress(staker.address)}</h3>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 mr-8">Total Wagers</span>
            <span className="font-semibold text-cyan-400"> + {staker.stakeCount} </span>
          </div>
          {/* <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Pools</span>
              <div className="flex gap-1">
                {staker.pools.map((pool, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                    {pool}
                  </span>
                ))}
              </div>
            </div> */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 mr-10">Total Wager Valuation </span>
            <span className="text-sm text-green-400">{formatStakeAmount(staker.totalStakes)} APT</span>
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
        <button className="text-cyan-400 flex items-center hover:text-cyan-300">
          View All <ArrowRight size={16} className="ml-2" />
        </button>
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
