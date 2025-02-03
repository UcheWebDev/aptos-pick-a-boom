import React, { useState, useMemo, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Unlock, UserRound, ListStart, X, AlignJustify } from "lucide-react";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { StakeCard } from "../components/StakeCard";
import { parseStakeData } from "../utils/stakeUtils";

import { toast } from "@/components/ui/use-toast";
import { getAllStakes } from "@/view-functions/getStakes";
import { useFilterStore, applyAllFilters } from "../stores/filterStore";

const CustomLoader = () => (
  <div className="relative flex items-center justify-center w-16 h-16">
    <div
      className="absolute w-full h-full border-4 rounded-full animate-spin"
      style={{
        borderColor: "transparent",
        borderTopColor: "#f59e0b",
        borderRightColor: "#ec4899",
        background: "linear-gradient(to right, #f59e0b, #ec4899)",
        WebkitBackgroundClip: "text",
      }}
    ></div>
    <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
      <span className="text-2xl font-bold text-amber-500">P</span>
    </div>
  </div>
);

export default function PlayPredictor() {
  const { amountFilter, creator, pair_id, walletAddress, setAmountFilter, setWalletAddress, setPairId, resetFilters } =
    useFilterStore();

  const [stakes, setStakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState("all");
  const { id } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["stake-content"],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        const content = await getAllStakes();
        setIsLoading(false);
        return { content };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        setIsLoading(false);
        return { content: "" };
      }
    },
  });

  const filteredStakesByTab = useMemo(() => {
    if (isLoading) return [];

    const parsedStakes = Array.isArray(stakes) ? stakes.map(parseStakeData) : [];
    switch (activeTab) {
      case "all":
        return parsedStakes;
      case "my_open":
        return parsedStakes.filter((stake) => account && stake.creator === account.address && stake.status === "Open");
      case "open":
        return parsedStakes.filter((stake) => stake.status === "Open");
      case "my_stakes":
        return parsedStakes.filter(
          (stake) => account && (stake.creator === account.address || stake.pairedWith === account.address),
        );
      default:
        return parsedStakes;
    }
  }, [stakes, activeTab, isLoading, account]);

  const finalFilteredStakes = useMemo(() => {
    return applyAllFilters(filteredStakesByTab, {
      amountFilter,
      creator: walletAddress,
      pair_id,
      statusFilter: "all",
    });
  }, [filteredStakesByTab, amountFilter, walletAddress, pair_id]);

  useEffect(() => {
    if (data) {
      setStakes(data.content);
    }
  }, [data]);

  const tabConfigs = [
    { value: "all", icon: <Globe className="h-5 w-5" />, label: "All Wagers" },
    { value: "open", icon: <Unlock className="h-5 w-5" />, label: "Open Wagers" },
    { value: "my_open", icon: <ListStart className="h-5 w-5" />, label: "My Open Wagers" },
    { value: "my_stakes", icon: <UserRound className="h-5 w-5" />, label: "My Wagers" },
  ];

  const isFiltersActive = amountFilter !== "all" || walletAddress !== "" || pair_id !== "";

  return (
    <div className="bg-gray-900 relative">
      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-gray-900 z-50 border-l border-gray-600 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 bg-gray-800 hover:bg-gray-800 rounded-lg mb-4"
            >
              <X className="h-5 w-5 text-white " />
            </button>

            <div className="space-y-6">
              <div className="mb-4">
                <div className="text-md mb-2 text-gray-400">Filter by amount</div>
                <Select value={amountFilter} onValueChange={setAmountFilter}>
                  <SelectTrigger className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">
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

              {/* <div className="mb-4">
                <div className="text-md mb-2 text-gray-400">Track wallet</div>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Paste Wallet Address"
                  className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 placeholder-gray-400"
                />
              </div> */}

              <div className="mb-4">
                <div className="text-md mb-2 text-gray-400">Filter by Pair ID</div>
                <input
                  type="text"
                  value={pair_id}
                  onChange={(e) => setPairId(e.target.value)}
                  placeholder="Paste Pair ID..."
                  className="w-full text-sm p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 placeholder-gray-400"
                />
              </div>

              <Button
                className="w-full p-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                onClick={resetFilters}
                disabled={!isFiltersActive}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative">
        {/* Filter Toggle Button */}
        <div className="absolute top-0 right-0 z-10 p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 shadow-2xl hover:from-amber-600 hover:to-pink-600 transition-all"
          >
            <AlignJustify className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            {tabConfigs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`flex items-center  ${activeTab === tab.value ? "relative group" : ""}`}
              >
                {activeTab === tab.value ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-sm font-bold hover:from-amber-600 hover:to-pink-600 transition-all "></div>
                    <div className="relative flex items-center space-x-2 text-white rounded-xl px-3  font-medium transition-all">
                      {tab.icon}
                      <span className="hidden sm:inline transition-colors">{tab.label}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {tab.icon}
                    <span className="ml-2 hidden sm:inline">{tab.label}</span>
                  </>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <CustomLoader />
          </div>
        )}

        {/* Stakes Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {finalFilteredStakes.map((stake) => (
                <StakeCard key={stake.id} stake={stake} authorizedUser={account} />
              ))}
            </div>

            {/* No Results State */}
            {finalFilteredStakes.length === 0 && (
              <div className="text-center py-8 text-gray-500">No stakes found matching your filters.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
