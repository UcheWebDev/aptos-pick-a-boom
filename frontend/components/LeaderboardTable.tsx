import React from "react";
import { Trophy, ArrowBigUp, Medal, ScrollText, Crown, Flame } from "lucide-react";
import { formatStakeAmount } from "@/utils/stakeUtils";

const LeaderboardTable = ({ stakes = [] }) => {
  const safeStakes = Array.isArray(stakes) ? stakes : [];

  const getWinnerStats = () => {
    if (safeStakes.length === 0) return [];

    const winnerStats = {};
    safeStakes.forEach((stake) => {
      try {
        const winner = stake.winner_addr;
        if (winner) {
          if (!winnerStats[winner]) {
            winnerStats[winner] = {
              address: winner,
              totalWins: 0,
              totalAmount: 0,
              largestWin: 0,
            };
          }
          const stakeAmount = stake.stake_amount || 0;
          winnerStats[winner].totalWins += 1;
          winnerStats[winner].totalAmount += stakeAmount;
          winnerStats[winner].largestWin = Math.max(winnerStats[winner].largestWin, stakeAmount);
        }
      } catch (error) {
        console.error("Error processing stake:", error);
      }
    });

    return Object.values(winnerStats)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);
  };

  const winners = getWinnerStats();

  const RankMedal = ({ rank }) => {
    if (rank === 0)
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg shadow-amber-500/20">
          <Crown className="h-5 w-5 text-white" />
        </div>
      );
    if (rank === 1)
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg">
          <Medal className="h-5 w-5 text-white" />
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg">
          <Medal className="h-5 w-5 text-white" />
        </div>
      );
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg">
        <span className="text-gray-400 font-bold">{rank + 1}</span>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-xl">
          <ScrollText className="h-8 w-8 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-300">No Winners Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            There are currently no recorded winners. Check back soon to see the leaderboard updates.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 rounded-xl shadow-lg shadow-amber-500/20">
              <div className="bg-gray-900 p-2.5 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Top Winners</h3>
              <p className="text-sm text-gray-400 mt-0.5">Global Leaderboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-semibold">{winners.length} Players</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          {winners.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-400 border-b border-gray-800/50">
                  <th className="text-left pb-4 font-medium">Rank</th>
                  <th className="text-left pb-4 font-medium">Winner</th>
                  <th className="text-right pb-4 font-medium">Total Wins</th>
                  <th className="text-right pb-4 font-medium">Largest Win</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => (
                  <tr
                    key={winner.address}
                    className={`
                      group transition-all duration-200 hover:bg-gray-800/30 
                      ${index === 0 ? "bg-amber-400/5" : ""}
                    `}
                  >
                    <td className="py-4 pl-4">
                      <RankMedal rank={index} />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                          {winner.address}
                        </span>
                        {index === 0 && (
                          <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                            <ArrowBigUp className="h-4 w-4" />
                            <span className="text-xs font-bold">1st</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] bg-gray-800 text-gray-300 px-2 py-1 rounded-lg font-mono text-sm">
                        {winner.totalWins}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="inline-flex items-center justify-center bg-amber-400/10 text-amber-400 px-3 py-1 rounded-lg font-mono text-sm">
                        {formatStakeAmount(winner.largestWin)} APT
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;
