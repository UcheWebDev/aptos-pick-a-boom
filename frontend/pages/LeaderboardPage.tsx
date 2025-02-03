import React, { useState, useEffect } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { CustomLoader } from "@/components/CustomLoader";

const LeaderboardPage = () => {
  const [data, setData] = useState([]);
  const [newStakes, setNewStakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: stakes, error } = await supabase
          .from("stakes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setData(stakes);
        setIsLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setNewStakes(data);
    }
  }, [data]);

  return (
    <div className="mt-8 mb-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <CustomLoader />
        </div>
      ) : (
        <LeaderboardTable stakes={newStakes} />
      )}
    </div>
  );
};

export default LeaderboardPage;
