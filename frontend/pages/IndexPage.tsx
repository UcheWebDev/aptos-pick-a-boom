import React, { useState, useEffect } from "react";
import MicroBettingBanner from "../components/Banner";
import FootballBlog from "../components/FootballBlog";

import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const IndexPage = () => {
  const [newStakes, setNewStakes] = useState([]);
  const [activeStakes, setActiveStakes] = useState([]);
  const [newsData, setNewsData] = useState({
    latestNews: [],
    transferNews: [],
    isLoading: true,
    error: null,
  });

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    const fetchNews = async () => {
      try {
        // Fetch all news articles from the news table
        const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Split news into categories
        const transfers = data.filter((article) => article.category === "transfer");
        const latest = data.filter((article) => article.category === "general");

        setNewsData({
          latestNews: latest,
          transferNews: transfers,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error fetching news:", err);
        setNewsData((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (data) {
      setNewStakes(data);
    }
  }, [data]);

  return (
    <>
      {/* <HeroSlider /> */}
      <div className="space-y-8">
        <MicroBettingBanner stake={newStakes} />
        <div className="">
          <FootballBlog {...newsData} />
        </div>
        {/* <StakeSwiper newStakes={newStakes} activeStakes={activeStakes} isLoading={isLoading} /> */}
      </div>
    </>
  );
};

export default IndexPage;
