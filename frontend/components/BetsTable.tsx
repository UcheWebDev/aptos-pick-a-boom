import React from "react";
import { Bet } from "../types/bet";

type BetsTableProps = {
  bets: Bet[];
};

export function BetsTable({ bets }: BetsTableProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-700 text-sm font-medium text-gray-400">
        <div>Game</div>
        <div>User</div>
        <div>Time</div>
        <div>Bet Amount</div>
        <div>Multiplier</div>
        <div>Payout</div>
      </div>
      <div className="divide-y divide-gray-700">
        {bets.map((bet) => (
          <div key={bet.id} className="grid grid-cols-6 gap-4 p-4 items-center text-sm text-white">
            <div className="flex items-center gap-2">
              {bet.icon}
              <span>{bet.game}</span>
            </div>
            <div>{bet.user}</div>
            <div>{bet.time}</div>
            <div>{bet.betAmount}</div>
            <div>{bet.multiplier}</div>
            <div className={bet.isPositive ? "text-green-400" : "text-red-400"}>{bet.payout}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
