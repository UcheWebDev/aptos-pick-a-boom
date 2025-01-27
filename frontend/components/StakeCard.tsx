import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  Eye,
  Loader2,
  CheckCircle,
  Check,
  Copy,
  Coins,
  Users,
  BookCheck,
  Trophy,
  Ban,
  CircuitBoard,
  Zap,
  MousePointerClick,
} from "lucide-react";
import Modal from "./Modal";
import { formatAddress, formatStakeAmount } from "../utils/stakeUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { pairFunc } from "@/entry-functions/pairFunc";
import { unStakeFunc } from "@/entry-functions/unStakeFunc";
import { confirmFunc } from "@/entry-functions/confirmFunc";

import SpinButton from "@/components/SpinButton";
import { toast } from "@/components/ui/use-toast";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { supabase } from "@/lib/supabase";

export function StakeCard({ stake, authorizedUser }) {
  const [isPairDialogOpen, setIsPairDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [txHash, settxHash] = useState("");
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [activeTab, setActiveTab] = useState("details");
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stakeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["stake-details", stake.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("stakes").select("*").eq("pair_id", stake.pair_id).single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch Wager Details",
        });
        throw error;
      }
      return data;
    },
    enabled: isDetailsDialogOpen,
  });

  const { data: selectedMatches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ["selected-matches", stake.id],
    queryFn: async () => {
      // First get the selected_matches array
      const { data: stakeData, error: stakeError } = await supabase
        .from("stakes")
        .select("selected_matches")
        .eq("pair_id", stake.pair_id)
        .single();

      if (stakeError) throw stakeError;

      if (!stakeData.selected_matches || !stakeData.selected_matches.length) {
        return [];
      }

      // Then fetch details for each match
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .in("matchId", stakeData.selected_matches);

      if (matchesError) throw matchesError;

      return matchesData;
    },
    enabled: isDetailsDialogOpen && activeTab === "matches",
  });

  const isOpen = stake.status === "Open";
  const isPaired = stake.status === "Paired";
  const isCompleted = stake.status === "Completed";

  const currentTime = new Date().getTime();
  const showStakeTime = stake.selectedTime;

  const handleSubmit = () => {
    setIsPairDialogOpen(true);
  };

  const handleConfirmPair = async () => {
    setisLoading(true);
    if (!account) {
      setisLoading(false);
      return;
    }
    try {
      const { data: stakeDt, error: stakeErr } = await supabase
        .from("stakes")
        .select("selected_matches")
        .eq("pair_id", stake.pair_id)
        .single();

      if (stakeErr) {
        throw new Error("Failed to fetch Wager matches");
      }

      if (!stakeDt.selected_matches || stakeDt.selected_matches.length === 0) {
        throw new Error("No matches selected for this Wager");
      }

      // const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-states`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     selected_matches: stakeDt.selected_matches,
      //   }),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.details || "Failed to check match states");
      // }

      // const matchStateCheck = await response.json();

      // if (!matchStateCheck.valid) {
      //   toast({
      //     title: "Cannot Pair Wager",
      //     description: matchStateCheck.message,
      //     variant: "destructive",
      //   });
      //   setisLoading(false);
      //   return;
      // }

      const amountInOctas = Math.floor(parseFloat(stake.amount) * 100000000);
      const committedTransaction = await signAndSubmitTransaction(pairFunc(amountInOctas, stake.creator, stake.id));
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      const { data: stakeData, error: stakeError } = await supabase
        .from("stakes")
        .update({
          pairer_addr: account.address,
          stake_id: stake.id,
          stake_status: "paired",
        })
        .eq("pair_id", stake.pair_id);

      if (stakeError) {
        toast({
          title: "Error",
          description: `Error recording Wager to DB`,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["pair-bet"],
      });
      settxHash(executedTransaction.hash);
      setisLoading(false);
      setIsPairDialogOpen(false);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      setisLoading(false);
      console.error(error);
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return "";
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  const navigateToMatchesPage = () => {
    navigate(`/matches-page/${stake.id}`);
  };

  const onUnstakeStake = async () => {
    setIsUnstakeDialogOpen(true);
  };

  const onCompleteStake = async () => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);

      if (!authorizedUser) {
        toast({
          title: "Error",
          description: "Please connect wallet first",
        });
        return;
      }

      const { data: stakeData, error: stakeError } = await supabase
        .from("stakes")
        .select("is_completed,pairer_addr")
        .eq("stake_id", Number(stake.id))
        .single();

      if (stakeError) {
        throw new Error("Wager not found");
      }

      if (stakeData.is_completed) {
        toast({
          title: "Notice",
          description: "This Wager has already been completed.",
        });
        return;
      }
      if (stakeData?.pairer_addr === authorizedUser?.address) {
        navigate(`/matches-page/${stake.id}`);
        return;
      }
      console.log(stakeData?.pairer_addr);
      console.log(authorizedUser?.address);

      const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stake_id: Number(stake.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check match results");
      }

      const result = await response.json();

      if (!result.completed) {
        toast({
          title: "Cannot Complete Wager",
          description: result.message,
          variant: "destructive",
        });
        return;
      }
      const committedTransaction = await signAndSubmitTransaction(confirmFunc(stake.id, result.winner));
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      // Update the stake status in the database
      const { error: updateError } = await supabase
        .from("stakes")
        .update({
          winner_addr: result.winner,
          is_completed: true,
        })
        .eq("stake_id", Number(stake.id));

      if (updateError) {
        throw new Error("Failed to update Wager winner");
      }
      toast({
        title: "Success",
        description: result.message + ` Transaction hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error("Error completing Wager:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleConfirmUnstake = async () => {
    setIsUnstakeLoading(true);
    try {
      const committedTransaction = await signAndSubmitTransaction(unStakeFunc(stake.id));
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      const { error } = await supabase.from("stakes").delete().eq("pair_id", stake.pair_id);
      if (error) {
        throw error;
      }
      setIsUnstakeModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["pair-bet"],
      });
      toast({
        title: "Success",
        description: "Wager has been successfully unstaked",
      });
    } catch (error) {
      console.error("Error unstaking:", error);
      toast({
        title: "Error",
        description: "Failed to unstake. Please try again.",
      });
    } finally {
      setIsUnstakeLoading(false);
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "paired":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(stake.pair_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isUserAuthorizedToComplete =
    authorizedUser?.address === stake.creator || authorizedUser?.address === stake.pairedWith;

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
          ${activeTab === tab ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-pink-600 transition-all" : "text-gray-500 "}`}
    >
      {label}
    </button>
  );

  return (
    <div className="">
      <div className="relative group">
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-pulse blur"></div>

        <div className="relative bg-gray-900 rounded-2xl p-6 border border-amber-500/20 backdrop-blur-xl">
          {/* Decorative circuit lines */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-md rounded-lg"></div>
                <div className="relative bg-gray-900 p-3 rounded-lg border border-amber-500">
                  <CircuitBoard className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {formatAddress(stake.creator)}
              </h3>
            </div>
            <div className="relative ml-4">
              <div className="absolute inset-0 bg-pink-500/20 blur-md rounded-full"></div>
              <div className="relative flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-pink-500/50">
                <Zap className="w-3 h-3 text-pink-500" />
                <span className="text-pink-400 font-bold text-sm">{stake.pair_id}</span>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                <p className="text-amber-400/60 text-sm mb-2">#</p>
                <p className="text-white font-mono font-bold">{stake.id}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                <p className="text-amber-400/60 text-sm mb-2">Wager Status</p>
                <p className="text-white font-mono font-bold">{stake.status}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/5 blur-md rounded-lg"></div>
              <div className="relative bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-amber-400/60">Wager Amount</span>
                  <span className="text-white font-mono font-bold">{stake.amount} APT</span>
                </div>
              </div>
            </div>
          </div>

          {/* <button className="relative w-full mt-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur group-hover:blur-md transition-all"></div>
            <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium group-hover:bg-gray-900/50 transition-all flex items-center justify-center gap-2">
              <span className="group-hover:text-amber-400 transition-colors">Stake Now</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button> */}
          <div className="flex gap-2 pt-2 mt-6">
            {isUserAuthorizedToComplete && !isPaired && !isCompleted ? (
              <>
                {/* <button
                  onClick={() => setIsDetailsDialogOpen(true)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-gray-400 font-medium transition-colors duration-200"
                >
                  View Details
                </button> */}
                <button className="relative w-full group" onClick={() => setIsDetailsDialogOpen(true)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur transition-all"></div>
                  <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className="transition-colors"> View Details</span>
                  </div>
                </button>
                {/* <button
                  onClick={() => onUnstakeStake()}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-full font-medium transition-colors hover:bg-red-700 shadow-sm hover:shadow"
                >
                  Unstake
                </button> */}
                <button className="relative w-full group" onClick={() => onUnstakeStake()}>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur transition-all"></div>
                  <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                    <Ban className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className=" transition-colors"> Unstake</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button className="relative w-full group" onClick={() => setIsDetailsDialogOpen(true)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur transition-all"></div>
                  <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className=" transition-colors"> View Details</span>
                  </div>
                </button>
                {isOpen && authorizedUser?.address && authorizedUser?.address !== stake.creator && (
                  <button className="relative w-full group" onClick={handleSubmit}>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur transition-all"></div>
                    <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                      <MousePointerClick className="w-4 h-4 mr-2" />
                      <span className=" transition-colors">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pair Wager"}
                      </span>
                    </div>
                  </button>
                )}
                {isPaired && isUserAuthorizedToComplete && (
                  <button className="relative w-full group" onClick={onCompleteStake} disabled={isCompleting}>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-pink-500 rounded-xl blur transition-all"></div>
                    <div className="relative bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                      <span className="group-hover:text-amber-400 transition-colors flex items-center">
                        {isCompleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trophy className="h-4 w-4 mr-2" />
                        )}
                        Complete
                      </span>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isPairDialogOpen} onOpenChange={setIsPairDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-400">Confirm Your Wager Pair</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Wager Amount:</span>
                <span className="font-semibold text-white">{stake.amount} APT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Creator:</span>
                <span className="font-semibold text-white">{formatAddress(stake.creator)}</span>
              </div>
            </div>
            <DialogDescription>
              By clicking confirm, you agree to pair this Wager with the specified amount.
            </DialogDescription>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button
              variant="outline"
              className=" px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors hover:text-white"
              onClick={() => setIsPairDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300"
              onClick={handleConfirmPair}
              disabled={isLoading}
            >
              {isLoading ? <SpinButton /> : "Confirm Pair"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto border-0 text-center bg-gray-900 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-green- p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-gray-400">Pairing Complete!</DialogTitle>
          <DialogDescription>Transaction hash: {txHash ? truncateHash(txHash) : ""}</DialogDescription>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => navigateToMatchesPage()} className="w-full sm:w-auto bg-cyan-400 text-dark">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] w-[90%] rounded-lg bg-gray-900  border border-gray-700 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-gray-100">Wager Informations</span>
              {/* <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stake.status === "Open" || stake.status === "Completed"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-blue-100 text-blue-700 border border-blue-300"
                }`}
              >
                {stake.status}
              </span> */}
            </DialogTitle>
          </DialogHeader>

          <div className="flex space-x-2 border-b border-gray-700 pb-4">
            <TabButton tab="details" label="Details" />
            {stake.status !== "Completed" && <TabButton tab="matches" label="Selected Matches" />}
          </div>

          {/* Existing tab content remains the same */}
          {/* Tab Content */}
          {activeTab === "details" ? (
            // Details Tab Content
            isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center space-y-3">
                  <SpinButton />
                  <p className="text-sm text-gray-500">Loading Wager Details...</p>
                </div>
              </div>
            ) : stakeDetails ? (
              <div className="space-y-6">
                {/* Main Info Section */}
                <div className="bg-gray-800 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Created By</p>
                      <p className="font-medium text-gray-400">{formatAddress(stake.creator)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="font-medium text-gray-400">{stake.amount} APT</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Cut</p>
                        <p className="text-lg font-semibold text-gray-400">{stakeDetails.total_cut}</p>
                      </div>
                      <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
                        <div className="bg-gray-900 p-2 rounded-lg">
                          <Coins className="w-5 h-5 text-amber-500" />
                        </div>
                      </div>
                      {/* <div className="bg-gray-900 p-2 rounded-full">
                        <Coins className="w-5 h-5 text-cyan-400" />
                      </div> */}
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Picks</p>
                        <p className="text-lg font-semibold text-gray-400">{stakeDetails.total_picks}</p>
                      </div>
                      {/* <div className="bg-gray-900 p-2 rounded-full">
                        <Users className="w-5 h-5 text-cyan-400" />
                      </div> */}
                      <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-lg">
                        <div className="bg-gray-900 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-900 p-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">Wager Created</p>
                        {/* <p className="text-sm text-gray-500">{formatDate(stakeDetails.created_at)}</p> */}
                      </div>
                    </div>

                    {stakeDetails.pairer_addr && (
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-900 p-1 rounded-full">
                          <Users className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">
                            Paired by {formatAddress(stakeDetails.pairer_addr)}
                          </p>
                          <p className="text-sm text-gray-500">Wager was paired</p>
                        </div>
                      </div>
                    )}

                    {stakeDetails.winner_addr && (
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-900 p-1 rounded-full">
                          <BookCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Wager completed</p>
                          <p className="text-sm text-gray-400">Winner is {formatAddress(stakeDetails.winner_addr)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Pair ID</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{stake.pair_id}</code>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Copy pair ID"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Failed to load Wager Details</p>
              </div>
            )
          ) : (
            // Matches Tab Content
            <div className="space-y-4">
              {isLoadingMatches ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <SpinButton />
                    <p className="text-sm text-gray-500">Loading selected matches...</p>
                  </div>
                </div>
              ) : selectedMatches?.length > 0 ? (
                selectedMatches.map((match) => (
                  <div key={match.matchId} className="bg-gray-800 p-4 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-cyan-400" />
                        <span className="font-medium text-gray-400">Match #{match.matchId}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Teams</p>
                        <p className="text-sm font-medium text-gray-400">
                          {match.homeTeam} vs {match.awayTeam}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium text-gray-400">{match.matchTime}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No matches selected for this Wager</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={isUnstakeDialogOpen} onOpenChange={setIsUnstakeDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg border-0 bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-400">Remove Wager</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Wager Amount:</span>
                <span className="font-semibold text-white">{stake.amount} APT</span>
              </div>
            </div>
            <DialogDescription>Are you sure you want to remove this wager ? This action cannot be undone.</DialogDescription>
          </div>
          <DialogFooter className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUnstakeDialogOpen(false)}
              disabled={isUnstakeLoading}
              className="w-auto px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnstake} disabled={isUnstakeLoading} className="w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300">
              {isUnstakeLoading ? <SpinButton /> : "Confirm "}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
