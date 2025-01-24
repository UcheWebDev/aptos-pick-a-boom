import React, { useState, useEffect } from "react";
import { HeroSlider } from "../components/HeroSlider";
import MicroBettingBanner from "../components/Banner";
import StakeSwiper from "../components/StakeSwiper";
import LeaderboardTable from "../components/LeaderboardTable";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const IndexPage = () => {
  const [newStakes, setNewStakes] = useState([]);
  const [activeStakes, setActiveStakes] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["stake-content"],
    queryFn: async () => {
      try {
        const { data: stakes, error } = await supabase
          .from("stakes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return stakes;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        return [];
      }
    },
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (data) {
      setNewStakes(data);
    }
  }, [data]);

  return (
    <>
      <div className="space-y-8">
        <MicroBettingBanner stake={newStakes} />
        <StakeSwiper newStakes={newStakes} activeStakes={activeStakes} isLoading={isLoading} />
        <div className="mt-8 mb-8">
          <LeaderboardTable stakes={newStakes} />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
