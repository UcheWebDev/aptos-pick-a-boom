import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StakeResults from "../components/StakeResults";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { CustomLoader } from "@/components/CustomLoader";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const StakeResultsPage = () => {
  const [stake, setStake] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const { id } = useParams();
  const { account } = useWallet();

  useEffect(() => {
    const fetchStakeData = async () => {
      try {
        setIsLoading(true);

        // Fetch the specific stake by ID
        const { data: stakeData, error } = await supabase
          .from("stakes")
          .select("*")
          .eq("stake_id", Number(id))
          .single();

        if (error) throw error;

        setStake(stakeData);
        setIsLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
        setIsLoading(false);
      }
    };

    if (id) {
      fetchStakeData();
    }
  }, [id]);

  // Additional effect to handle account loading state
  useEffect(() => {
    // Check if account is ready
    if (account) {
      setIsAccountLoading(false);
    }
  }, [account]);

  // Render loading state
  if (isLoading || isAccountLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <CustomLoader />
      </div>
    );
  }

  // Handle no stake found
  if (!stake) {
    return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">Stake not found</div>;
  }

  // Handle no account
  if (!account?.address) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
        Please connect your wallet
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header section */}
      <div className="bg-gray-900 text-white sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Link to="/" className="flex items-center text-white hover:text-blue-200">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">Back</span>
                </Link>
                <h1 className="text-lg font-bold">Wager Results</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StakeResults
        isWon={stake.winner_addr === account.address}
        amount={stake.stake_amount}
        matches={stake.selected_matches || []}
        date={new Date(stake.created_at).toLocaleDateString()}
        totalSelectedMatches={stake.selected_matches?.length || 0}
      />
    </div>
  );
};

export default StakeResultsPage;
