import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletSelector } from "../components/WalletSelector";

import { ArrowLeft, ChevronDown, Check, Copy, ChevronRight, Plus, Minus } from "lucide-react";

const HistoryPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const betHistory = [
    {
      id: 1,
      type: "Single",
      count: "1/1",
      stake: 5000.0,
      odds: 3.5,
      potentialWin: 17500.0,
      status: "won",
      wonAmount: 17500.0,
    },
    {
      id: 2,
      type: "Multiple",
      count: "2/3",
      stake: 1000.0,
      odds: 2.5,
      potentialWin: 2500.0,
      status: "lost",
    },
    // Add more history items as needed
  ];

  const formatCurrency = (amount) => {
    return `₦${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center fixed top-0 left-0 right-0">
        <header className="bg-white px-4 py-4 flex items-center justify-between max-w-4xl w-full">
          <div className="flex justify-between items-center gap-4 ">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </Link>
            <h1 className="text-xs md:text-sm  text-gray-800">History</h1>
          </div>
          <div className="relative">
            <WalletSelector />
          </div>
        </header>
      </div>

      <div className="max-w-2xl mx-auto p-6 pt-24">
        <div className="bg-white space-y-6">
          <div className="space-y-6">
            {betHistory.map((bet) => (
              <div key={bet.id} className="bg-white rounded-xl shadow">
                {/* Header - Always visible */}
                <div className="p-4" onClick={() => setExpandedId(expandedId === bet.id ? null : bet.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-5 w-5 rounded-full ${bet.status === "won" ? "bg-green-500" : "bg-red-500"} flex items-center justify-center`}
                        >
                          {bet.status === "won" ? (
                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 text-xs md:text-sm">{bet.type}</span>
                      </div>
                      <span className="text-gray-400 text-xs md:text-sm">{bet.count}</span>
                    </div>
                    <button className="p-2">
                      <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedId === bet.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
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

                    {bet.status === "won" && (
                      <>
                        <div className="flex justify-center mb-4">
                          <div>
                            <span className="text-gray-600 mr-2 text-xs md:text-sm">You won:</span>
                            <span className="text-green-500 font-semibold text-xs md:text-sm">{formatCurrency(bet.wonAmount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                              <div className="font-medium text-xs md:text-sm">That Winning Feeling!</div>
                              <div className=" text-gray-400 text-xs md:text-sm">Share on your socials</div>
                            </div>
                          </div>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-xs md:text-sm font-medium">
                            SHARE
                          </button>
                        </div>
                      </>
                    )}

                    {/* <div className="flex justify-center mt-6">
                      <div className="text-blue-900 font-bold text-xl tracking-tight">
                        Bet<span>King</span>
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
