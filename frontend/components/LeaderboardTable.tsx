import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowBigUp, Medal, ScrollText } from "lucide-react";
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

  // Function to truncate address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to get rank medal
  const RankMedal = ({ rank }) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-gray-500 font-medium">{rank + 1}</span>;
  };

  // Empty state component
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
    <>
      <div className="text-xl font-bold flex items-center gap-2 mb-4 text-white">Leatherboards</div>
      <Card className="w-full bg-gray-800 border border-gray-700">
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
                      border-b border-gray-700 last:border-0 ${index < 3 ? "font-medium" : ""}
                      `}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <RankMedal rank={index} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white">
                          {truncateAddress(winner.address)}
                          {index === 0 && <ArrowBigUp className="h-4 w-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">{winner.totalWins}</td>
                      <td className="p-4 text-right text-gray-600">{formatStakeAmount(winner.largestWin)} APT</td>
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
    </>
  );
};

export default LeaderboardTable;
