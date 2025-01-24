import React, { useState } from "react";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { mockActivities, mockEvents } from "../../data/mockData";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useFilterStore } from "../../stores/filterStore";

interface RightSidebarProps {
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { amountFilter, walletAddress, pairId, setAmountFilter, setWalletAddress, setPairId, resetFilters } =
    useFilterStore();

  const isFiltersActive = amountFilter !== "all" || walletAddress !== "" || pairId !== "";

  return (
    <aside className="w-80 bg-gray-900 h-full overflow-y-auto border-r border-gray-600">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isDesktop && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Content */}

        <div className="p-4 space-y-6">
          <div className="mb-4">
            <div className="text-md mb-2 text-gray-400">Filter amount</div>
            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-600 placeholder-gray-400 text-gray-400">
                <SelectValue placeholder="Filter Stake Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="low">Low ({"<"}100)</SelectItem>
                <SelectItem value="medium">Medium (100-500)</SelectItem>
                <SelectItem value="high">High ({">"} 500)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <div className="text-md mb-2 text-gray-400">Track wallet</div>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Paste Wallet Address"
              className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-400 placeholder-gray-400"
            />
          </div>

          <div className="mb-4">
            <div className="text-md mb-2 text-gray-400">Pair ID</div>
            <input
              type="text"
              value={pairId}
              onChange={(e) => setPairId(e.target.value)}
              placeholder="Paste Pair ID..."
              className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-400 placeholder-gray-400"
            />
          </div>

          {/* <button className="w-full p-3 text-sm rounded-lg bg-blue-600 text-white font-medium mb-4 swiper-title">
            load
          </button> */}
          <Button
            className="w-full p-3 text-sm rounded-lg bg-cyan-400 text-dark font-medium mb-4 swiper-title"
            onClick={resetFilters}
            disabled={!isFiltersActive}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
