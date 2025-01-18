import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MOCK_BETS = [
  { id: 1, amount: 200000.0, time: "1 min ago", type: "Sports Betting", code: "81*****503" },
  { id: 2, amount: 41308.33, time: "1 min ago", type: "Sports Betting", code: "80*****879" },
  { id: 3, amount: 47277.86, time: "1 min ago", type: "Sports Betting", code: "80*****977" },
  { id: 4, amount: 31106.08, time: "1 min ago", type: "Sports Betting", code: "90*****690" },
  { id: 5, amount: 70847.61, time: "1 min ago", type: "Sports Betting", code: "80*****489" },
];

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState("betslip");
  const [isReal, setIsReal] = useState(true);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <aside className="hidden lg:flex h-screen w-[280px] flex-col bg-muted/40 bg-slate-800 fixed top-0 right-0 h-full z-40">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          className={`flex-1 py-4 text-lg font-medium ${
            activeTab === "betslip" ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("betslip")}
        >
          Betslip
        </button>
        <button
          className={`flex-1 py-4 text-lg font-medium ${
            activeTab === "cashout" ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("cashout")}
        >
          Cashout
        </button>
      </div>
      {/* Toggle Switch */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-slate-700 w-fit rounded-full p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isReal ? "bg-green-500 text-white" : "bg-transparent text-gray-400"
            }`}
            onClick={() => setIsReal(true)}
          >
            REAL
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !isReal ? "bg-slate-600 text-white" : "bg-transparent text-gray-400"
            }`}
            onClick={() => setIsReal(false)}
          >
            SIM
          </button>
        </div>
      </div>
      {/* Content */}
      {activeTab === "betslip" ? (
        <div className="p-4">
          <p className="text-sm mb-4 text-gray-400">To place a bet, click on the odds. Or insert a booking code</p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Booking Code"
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-600 placeholder-gray-400"
            />
          </div>

          <button className="w-full p-3 rounded-lg bg-gray-200 text-gray-400 font-medium mb-4">Load</button>

          <p className="text-gray-400 text-sm">
            A booking code enables one to transfer a betslip between different devices.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {MOCK_BETS.map((bet) => (
            <div
              key={bet.id}
              className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-500 text-lg font-medium">NGN{formatCurrency(bet.amount)}</span>
                <span className="text-gray-400 text-sm">{bet.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{bet.type}</span>
                <span className="text-gray-400">{bet.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      );
    </aside>
  );
}
