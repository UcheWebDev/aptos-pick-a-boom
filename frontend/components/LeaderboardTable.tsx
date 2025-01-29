import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowBigUp, Medal, ScrollText, TrendingUp, Crown } from "lucide-react";
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
    if (rank === 0) return <Crown className="h-5 w-5 text-amber-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-gray-500 font-medium">{rank + 1}</span>;
  };

  const EmptyState = () => (
    <div className="py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-800/50 p-4 rounded-full">
          <ScrollText className="h-8 w-8 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-400">No Winners Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            There are currently no recorded winners. Check back soon to see the leaderboard updates.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
            <div className="bg-gray-900 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Top Winners</h3>
            <p className="text-sm text-gray-400">Global Leaderboard</p>
          </div>
        </div>
        <div className="bg-amber-400/10 px-3 py-1 rounded-full">
          <span className="text-amber-400 font-medium">{winners.length} Players</span>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="overflow-x-auto">
          {winners.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-400">
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Winner</th>
                  <th className="text-right p-2">Total Wins</th>
                  <th className="text-right p-2">Largest Win</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => (
                  <tr key={winner.address} className="border-t border-gray-700/50 text-white">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <RankMedal rank={index} />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {winner.address}
                        {index === 0 && <ArrowBigUp className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="p-2 text-right">{winner.totalWins}</td>
                    <td className="p-2 text-right">{formatStakeAmount(winner.largestWin)} APT</td>
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
