import React, { useState, useMemo, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { ArrowLeft, Globe, Unlock, UserRound, ListStart } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StakeCard } from "../components/StakeCard";
import { parseStakeData } from "../utils/stakeUtils";

import { toast } from "@/components/ui/use-toast";
import { getAllStakes } from "@/view-functions/getStakes";
import { useFilterStore, applyAllFilters } from "../stores/filterStore";

export default function PlayPredictor() {
  const { amountFilter, creator, pair_id } = useFilterStore();
  const [stakes, setStakes] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState("all");
  const { id } = useParams(); // URL path parameter

  const { data } = useQuery({
    queryKey: ["stake-content"],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        const content = await getAllStakes();
        setisLoading(false);
        return {
          content,
        };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        setisLoading(false);
        return {
          content: "",
        };
      }
    },
  });

  // Filter stakes based on tabs and user
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
      creator,
      pair_id,
      statusFilter: 'all' // We're handling status through tabs instead
    });
  }, [filteredStakesByTab, amountFilter, creator, pair_id]);

  // const handleStatusFilterChange = (value) => {
  //   setStatusFilter(value);
  // };

  useEffect(() => {
    if (data) {
      setStakes(data.content);
    }
  }, [data]);

  const tabConfigs = [
    {
      value: "all",
      icon: <Globe className="h-5 w-5" />,
      label: "All Stakes",
    },
    {
      value: "open",
      icon: <Unlock className="h-5 w-5" />,
      label: "Open Stakes",
    },
    {
      value: "my_open",
      icon: <ListStart className="h-5 w-5" />,
      label: "My Open Stakes",
    },
    {
      value: "my_stakes",
      icon: <UserRound className="h-5 w-5" />,
      label: "My Stakes",
    },
  ];

  return (
    <div className="bg-gray-900">
      {/* Main Content */}
      <div className="bg-gray-900">
        {/* <div className="text-left mb-10">
          <h1 className="text-2xl font-bold mb-2">Wager Listings</h1>
          <p className="text-gray-600">Make your predictions for a chance to win!</p>
        </div> */}

        {/* Tabs */}
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 ">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            {tabConfigs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
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
