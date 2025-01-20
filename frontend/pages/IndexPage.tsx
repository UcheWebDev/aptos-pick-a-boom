import React, { useState, useEffect } from "react";
import WelcomeCard from "../components/U/WelcomeCard";
import { HeroSlider } from "../components/HeroSlider";
import MicroBettingBanner from "../components/Banner";
import StakeSwiper from "../components/StakeSwiper"; // Add this import
import LeaderboardTable from "../components/LeaderboardTable";

import { toast } from "@/components/ui/use-toast";

import { getAllStakes } from "@/view-functions/getStakes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const IndexPage = () => {
  const [newStakes, setNewStakes] = useState([]);
  const [activeStakes, setActiveStakes] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ["stake-content"],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        // setisLoading(true);
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

  useEffect(() => {
    if (data) {
      setNewStakes(data.content);
    }
  }, [data]);

  return (
    <>
      <div className="space-y-8">
        <MicroBettingBanner stakes={newStakes} />
        <StakeSwiper newStakes={newStakes} activeStakes={activeStakes} isLoading={isLoading} />
        <div className="mt-8 mb-8">
          <LeaderboardTable stakes={newStakes} />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
