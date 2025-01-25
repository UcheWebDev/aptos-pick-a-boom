import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowBigUp, Medal, ScrollText, Rocket } from "lucide-react";
import { formatStakeAmount } from "@/utils/stakeUtils";

const LeaderboardTable = ({ stakes = [] }) => {
  const safeStakes = Array.isArray(stakes) ? stakes : [];
  const getWinnerStats = () => {
    if (safeStakes.length === 0) {
      return [];
    }

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

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const RankMedal = ({ rank }) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-gray-500 font-medium">{rank + 1}</span>;
  };

  const EmptyState = () => (
    <div className="py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <ScrollText className="h-8 w-8 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-500">No Winners Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            There are currently no recorded winners. Check back soon to see the leaderboard updates.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur-sm"></div>

      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-amber-500/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold flex items-center gap-2 text-white">Leaderboards</div>
          <div className="bg-gradient-to-r from-pink-500 to-amber-500 p-0.5 rounded-lg">
            <div className="bg-gray-900 p-2 rounded-lg">
              <Rocket className="w-5 h-5 text-pink-500" />
            </div>
          </div>
        </div>

        <CardContent>
          <div className="overflow-x-auto">
            {winners.length > 0 ? (
              <table className="w-full shadow-md">
                <thead>
                  <tr className="border-b border-gray-700 text-sm text-gray-500">
                    <th className="text-left p-4 text-white">Rank</th>
                    <th className="text-left p-4 text-white">Winner</th>
                    <th className="text-right p-4 text-white">Total Wins</th>
                    <th className="text-right p-4 text-white">Largest Win (APT)</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner, index) => (
                    <tr
                      key={winner.address}
                      className={`
                      border-b border-gray-700 last:border-0 
                      transition-all duration-300 hover:bg-gray-800/50 
                      ${index < 3 ? "font-medium" : ""}
                      `}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <RankMedal rank={index} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white">
                          {(winner.address)}
                          {index === 0 && <ArrowBigUp className="h-4 w-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">{winner.totalWins}</td>
                      <td className="p-4 text-right text-gray-100">{formatStakeAmount(winner.largestWin)} APT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardTable;
