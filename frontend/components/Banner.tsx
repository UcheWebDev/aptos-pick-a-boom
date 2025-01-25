import React from "react";
import { BarChart3, ArrowUpRight, Coins, Clock } from "lucide-react";

// Format stake amount from octas to APT
export const formatStakeAmount = (amount) => {
  // Convert from octas to APT (1 APT = 100000000 octas)
  return parseInt(amount) / 100000000;
};

const StatSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[1, 2, 3].map((item) => (
      <div key={item} className="bg-gray-800 p-6 border rounded-lg border-gray-700 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 rounded-lg w-12 h-12"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

const MicroBettingBanner = ({ stake = [] }) => {
  // Check if stake is loading or empty
  if (!stake || stake.length === 0) {
    return <StatSkeleton />;
  }

  // Safely compute total staked amount using formatStakeAmount
  const totalStaked = stake.reduce((sum, s) => sum + (s?.stake_amount ? formatStakeAmount(s.stake_amount) : 0), 0);

  // Safely compute total winnings from completed stakes
  const totalWinnings = stake
    .filter((s) => s?.is_completed)
    .reduce((sum, s) => sum + (s?.stake_amount ? formatStakeAmount(s.stake_amount) : 0), 0);

  // Safely sort and filter stakes
  const sortedStakes = stake
    .filter((s) => s?.created_at)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Get current and previous month's stakes
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const currentMonthStakes = sortedStakes
    .filter((s) => new Date(s.created_at).getMonth() === currentMonth)
    .reduce((sum, s) => sum + (s?.stake_amount ? formatStakeAmount(s.stake_amount) : 0), 0);

  const previousMonthStakes = sortedStakes
    .filter((s) => {
      const stakeDate = new Date(s.created_at);
      return stakeDate.getMonth() === previousMonth;
    })
    .reduce((sum, s) => sum + (s?.stake_amount ? formatStakeAmount(s.stake_amount) : 0), 0);

  // Calculate percentage change from previous month
  const percentageChange =
    previousMonthStakes > 0 ? ((currentMonthStakes - previousMonthStakes) / previousMonthStakes) * 100 : 0;

  // Calculate months active
  const firstStakeDate = new Date(sortedStakes[0].created_at);
  const monthsDiff =
    (currentDate.getFullYear() - firstStakeDate.getFullYear()) * 12 +
    (currentDate.getMonth() - firstStakeDate.getMonth());

  // Compute average monthly performance
  const avgAPY = monthsDiff > 0 ? ((totalWinnings / totalStaked) * 100) / monthsDiff : 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20">
            <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <p className="text-gray-400">Total Value Staked</p>
                <h3 className="text-2xl font-bold text-white">
                  {typeof totalStaked === "number" ? totalStaked.toFixed(2) : "0.00"} APT
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <ArrowUpRight size={16} />
              <span className="ml-1">
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(1)}% from previous month
              </span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20">
            <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <Coins className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <p className="text-gray-400">Total Winings</p>
                <h3 className="text-2xl font-bold text-white">
                  {typeof totalWinnings === "number" ? totalWinnings.toFixed(2) : "0.00"} APT
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <ArrowUpRight size={16} />
              <span className="ml-1">+{avgAPY.toFixed(1)}% monthly</span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20">
            <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <p className="text-gray-400">Average APY</p>
                <h3 className="text-2xl font-bold text-white">
                  {typeof avgAPY === "number" ? avgAPY.toFixed(1) : "0.0"}%
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400">
              <ArrowUpRight size={16} />
              <span className="ml-1">Active for {monthsDiff} months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroBettingBanner;
