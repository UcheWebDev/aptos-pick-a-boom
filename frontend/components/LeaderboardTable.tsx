import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Medal, ScrollText } from "lucide-react";
import { parseStakeData } from "../utils/stakeUtils";

const LeaderboardTable = ({ stakes = [] }) => {
  // Ensure stakes is an array
  const safeStakes = Array.isArray(stakes) ? stakes : [];

  // Convert octas to APT
  const octasToApt = (octas) => {
    return Number(octas) / 100000000;
  };

  // Process stakes to get winner statistics
  const getWinnerStats = () => {
    if (safeStakes.length === 0) {
      return [];
    }

    const winnerStats = {};

    safeStakes.forEach((stake) => {
      try {
        const parsedStake = parseStakeData(stake);
        const winner = parsedStake?.winner;

        if (winner) {
          if (!winnerStats[winner]) {
            winnerStats[winner] = {
              address: winner,
              totalWins: 0,
              totalAmount: 0,
              largestWin: 0,
            };
          }

          const stakeAmount = parsedStake.amount || 0;
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
          <h3 className="text-lg font-medium text-gray-900">No Winners Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            There are currently no recorded winners. Check back soon to see the leaderboard updates.
          </p>
        </div>
        <div className="pt-4">
          <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Trophy className="h-4 w-4 mr-2" />
            Future Champions Await
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">Boom Kings</div>
      <Card className="w-full shadow-sm border">
        <CardContent>
          <div className="overflow-x-auto">
            {winners.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Winner</th>
                    <th className="text-right py-3 px-4">Total Wins</th>
                    <th className="text-right py-3 px-4">Total Amount (APT)</th>
                    <th className="text-right py-3 px-4">Largest Win (APT)</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner, index) => (
                    <tr
                      key={winner.address}
                      className={`
                        border-b border-gray-100 hover:bg-gray-50 transition-colors
                        ${index < 3 ? "font-medium" : ""}
                      `}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <RankMedal rank={index} />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {truncateAddress(winner.address)}
                          {index === 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">{winner.totalWins}</td>
                      <td className="py-3 px-4 text-right">{winner.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{winner.largestWin.toFixed(2)}</td>
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
