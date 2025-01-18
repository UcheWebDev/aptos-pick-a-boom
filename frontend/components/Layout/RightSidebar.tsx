import React, { useState } from "react";
import { X } from "lucide-react";
import { mockActivities, mockEvents } from "../../data/mockData";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface RightSidebarProps {
  onClose: () => void;
}

const MOCK_BETS = [
  { id: 1, amount: 200000.0, time: "1 min ago", type: "Sports Betting", code: "81*****503" },
  { id: 2, amount: 41308.33, time: "1 min ago", type: "Sports Betting", code: "80*****879" },
  { id: 3, amount: 47277.86, time: "1 min ago", type: "Sports Betting", code: "80*****977" },
  { id: 4, amount: 31106.08, time: "1 min ago", type: "Sports Betting", code: "90*****690" },
  { id: 5, amount: 70847.61, time: "1 min ago", type: "Sports Betting", code: "80*****489" },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState("betslip");
  const [isReal, setIsReal] = useState(true);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <aside className="w-80 bg-gray-50 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isDesktop && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            className={`flex-1 py-4 font-medium ${
              activeTab === "betslip" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("betslip")}
          >
            Load
          </button>
          <button
            className={`flex-1 py-4 font-medium ${
              activeTab === "cashout" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-800"
            }`}
            onClick={() => setActiveTab("cashout")}
          >
            Slips
          </button>
        </div>
        {/* Toggle Switch */}
        {/* <div className="p-4">
          <div className="flex items-center gap-2 border border-slate-700 w-fit rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                isReal ? "bg-blue-500 text-white" : "bg-transparent text-gray-400"
              }`}
              onClick={() => setIsReal(true)}
            >
              REAL
            </button>
            <button
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                !isReal ? "bg-slate-600 text-white" : "bg-transparent text-gray-400"
              }`}
              onClick={() => setIsReal(false)}
            >
              SIM
            </button>
          </div>
        </div> */}
        {/* Content */}
        {activeTab === "betslip" ? (
          <div className="p-4">
            <p className="mb-4 text-gray-500 text-sm">To place a bet, click on the odds. Or insert a booking code</p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Pair Address..."
                className="w-full text-sm p-3 rounded-lg border border-gray-600 text-gray-600 placeholder-gray-500"
              />
            </div>

            <button className="w-full p-3 text-sm rounded-lg bg-blue-600 text-white font-medium mb-4 swiper-title">load</button>

            <p className="text-gray-500 text-xs">
              A booking code enables one to transfer a betslip between different devices.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {MOCK_BETS.map((bet) => (
              <div
                key={bet.id}
                className="bg-white shadow-sm rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blue-500 font-medium">NGN {formatCurrency(bet.amount)}</span>
                  <span className="text-gray-400 text-xs">{bet.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{bet.type}</span>
                  <span className="text-gray-400 text-sm">{bet.code}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </aside>
  );
};

export default RightSidebar;
