import React from "react";

interface FiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  amountFilter: string;
  setAmountFilter: (amount: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ statusFilter, setStatusFilter, amountFilter, setAmountFilter }) => {
  return (
    <div className="space-y-4 p-2">
      <div className="flex gap-4 overflow-x-auto py-2">
        {["all", "open", "closed"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${statusFilter === status ? "bg-gray-200 text-blue-700" : "text-gray-400 hover:bg-blue-700 hover:text-white"}`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
          className="bg-gray-200 text-dark rounded-lg px-3 py-2 text-sm w-full"
        >
          <option value="">All Amounts</option>
          <option value="0-1000">0 - 1,000 USDT</option>
          <option value="1000-10000">1,000 - 10,000 USDT</option>
          <option value="10000+">10,000+ USDT</option>
        </select>
      </div>
    </div>
  );
};
