import React, { useState } from "react";
import { formatCurrency } from "@/utils/formatter";
import { BetHistoryItem } from "@/types/betting";
import { ChevronDown, Check, X, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface BetHistoryListProps {
  bets: BetHistoryItem[];
}
const EmptyBetHistory: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
    <div className="rounded-full bg-gray-100 p-8 mb-6">
      <FileText className="w-5 h-5 text-gray-500" />
    </div>
    <p className="text-gray-400 text-sm text-center max-w-md mb-6">No recent transaction or bet recorded yet</p>
  </div>
);

const BetHistoryList: React.FC<BetHistoryListProps> = ({ bets }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (bets.length === 0) {
    return <EmptyBetHistory />;
  }

  return (
    <div className="space-y-2 p-3 ">
      {bets.map((bet) => (
        <div key={bet.id} className="shadow bg-white">
          {/* Header */}
          <div className="p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === bet.id ? null : bet.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className={`h-5 w-5 rounded-full ${
                      bet.status === "won" ? "bg-green-500" : "bg-red-500"
                    } flex items-center justify-center`}
                  >
                    {bet.status === "won" ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <X className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="ml-2 text-xs md:text-sm">{bet.type}</span>
                </div>
                {/* <span className="text-gray-400 text-xs md:text-sm">{bet.count}</span> */}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-900 transition-transform ${expandedId === bet.id ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {/* Expandable Content */}
          {expandedId === bet.id && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-y-2 mb-4">
                <div className="text-gray-500 text-xs md:text-sm">Stake:</div>
                <div className="text-right text-xs md:text-sm">{formatCurrency(bet.stake)}</div>

                <div className="text-gray-500 text-xs md:text-sm">Total Odds:</div>
                <div className="text-right text-xs md:text-sm">{bet.odds}</div>

                <div className="text-gray-500 text-xs md:text-sm">Potential Win:</div>
                <div className="text-right text-xs md:text-sm">{formatCurrency(bet.potentialWin)}</div>
              </div>

              {bet.status === "won" && bet.wonAmount && (
                <>
                  <div className="flex justify-center mb-4">
                    <div>
                      <span className="text-gray-600 mr-2 text-xs md:text-sm">You won:</span>
                      <span className="text-green-500 font-semibold text-xs md:text-sm">
                        {formatCurrency(bet.wonAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <div className="font-medium text-xs md:text-sm">That Winning Feeling!</div>
                        <div className="text-gray-400 text-xs md:text-sm">Share on your socials</div>
                      </div>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-xs md:text-sm font-medium">
                      SHARE
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="text-center p-10">
        <span className="text-xs md:text-sm text-gray-500">A maximum of 20 bets are shown , go to Betlist to view all bet</span>
        {/* <Link to="/" className="transparent border border-gray-500 rounded-full mt-4 p-4 text-gray-600 text-xs md:text-sm">View more</Link> */}
      </div>
    </div>
  );
};

export default BetHistoryList;
