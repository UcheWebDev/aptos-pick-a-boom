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
  TrendingUp,
  Wallet,
  Clock,
  ChevronRight,
  Timer,
  MapPin,
  ListChecks,
  Crown,
  Dices,
  MousePointerClick,
  Save,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import { pairFunc } from "@/entry-functions/pairFunc";
import { unStakeFunc } from "@/entry-functions/unStakeFunc";
import { confirmFunc } from "@/entry-functions/confirmFunc";

import SpinButton from "@/components/SpinButton";
import { toast } from "@/components/ui/use-toast";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { supabase } from "@/lib/supabase";
import { formatMatchesTimestamp } from "@/utils/formatter";

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

  const winningAmount = parseFloat(stake.amount) * 2;

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

      const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-states`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_matches: stakeDt.selected_matches,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to check match states");
      }

      const matchStateCheck = await response.json();

      if (!matchStateCheck.valid) {
        toast({
          title: "Cannot Pair Wager",
          description: matchStateCheck.message,
          variant: "destructive",
        });
        setisLoading(false);
        return;
      }

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
      navigate(`/stake-results/${stake.id}`);
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

  const handleSave = () => {
    navigate(`/stake-results/${stake.id}`);
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-xl border border-gray-800/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-pink-500 p-0.5 rounded-xl shadow-lg shadow-amber-500/20">
                <div className="bg-gray-900 p-2.5 rounded-xl">
                  <CircuitBoard className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500" />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {formatAddress(stake.creator)}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">Staker</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20">
              <span className="text-emerald-400 font-mono text-sm tracking-tight">{stake.pair_id}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-4 backdrop-blur-xl border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-400 font-medium">Pot Win</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">{winningAmount}</span>
                  <span className="text-sm font-medium text-amber-500">APT</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-4 backdrop-blur-xl border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Dices className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-400 font-medium">Total Matches</span>
                </div>
                <span className="text-lg font-bold text-white">{stake.total_games}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-4 backdrop-blur-xl border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Wager Amount</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{stake.amount}</span>
                    <span className="text-sm font-medium text-amber-500">APT</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Status</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <span className="text-sm font-semibold text-amber-400">{stake.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {isUserAuthorizedToComplete && !isPaired && !isCompleted ? (
              <>
                {/* <button
                onClick={() => setIsDetailsDialogOpen(true)}
                className="flex-1 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 transition-all duration-300 group-hover:opacity-90"></div>
                <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-sm font-semibold text-white">View Details</span>
                </div>
              </button> */}
                <button
                  onClick={() => setIsDetailsDialogOpen(true)}
                  className="flex-1 group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1px]"
                >
                  <div className="relative h-full bg-gray-900 rounded-[11px] px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-gray-900/95 transition-colors">
                    <Eye className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-semibold text-amber-400">View</span>
                  </div>
                </button>

                <button onClick={onUnstakeStake} className="flex-1 relative overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-center gap-2 bg-gray-800 border border-amber-500/50 rounded-xl hover:bg-gray-800/80 transition-colors">
                    <Ban className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Unstake</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsDetailsDialogOpen(true)}
                  className="flex-1 group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1px]"
                >
                  <div className="relative h-full bg-gray-900 rounded-[11px] px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-gray-900/95 transition-colors">
                    <Eye className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-semibold text-amber-400">View</span>
                  </div>
                </button>

                {!isOpen && isUserAuthorizedToComplete && isCompleted && (
                  <button
                    onClick={handleSave}
                    className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1px]"
                  >
                    <div className="relative h-full bg-gray-900 rounded-[11px] px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-900/95 transition-colors">
                      <Save className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-400">Save</span>
                    </div>
                  </button>
                )}

                {isOpen && authorizedUser?.address && authorizedUser.address !== stake.creator && (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1px]"
                  >
                    <div className="relative h-full bg-gray-900 rounded-[11px] px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-900/95 transition-colors">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      ) : (
                        <>
                          <MousePointerClick className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">Pair</span>
                        </>
                      )}
                    </div>
                  </button>
                )}

                {isPaired && isUserAuthorizedToComplete && (
                  <button
                    onClick={onCompleteStake}
                    disabled={isCompleting}
                    className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1px]"
                  >
                    <div className="relative h-full bg-gray-900 rounded-[11px] px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-900/95 transition-colors">
                      {isCompleting ? (
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      ) : (
                        <>
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">Complete</span>
                        </>
                      )}
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
            <DialogTitle className="text-center text-lg text-amber-500">Confirm Your Wager Pair</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b pb-4 mt-4">
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
              By clicking confirm, you agree to pair this Wager with the specified amount and a 0.05 APT contract fee.
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
        <DialogContent className="w-[90%] max-w-md mx-auto border border-gray-700 text-center bg-gray-900 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-green- p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-gray-400">Pairing Complete!</DialogTitle>
          <DialogDescription>Transaction hash: {txHash ? truncateHash(txHash) : ""}</DialogDescription>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => navigateToMatchesPage()}
              className="bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wager Information Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-gray-800/50 shadow-2xl">
          <DialogHeader className="p-6 border-b border-gray-800/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-amber-500 rounded-full" />
                <DialogTitle className="text-xl text-gray-100 font-bold tracking-tight">Wager Information</DialogTitle>
              </div>
              <div className="flex gap-2 w-full sm:w-auto bg-gray-800/50 p-1 rounded-full">
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
                    activeTab === "details"
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                {!isLoadingDetails && !stakeDetails?.is_completed && (
                  <button
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
                      activeTab === "matches"
                        ? "bg-amber-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                    onClick={() => setActiveTab("matches")}
                  >
                    Matches
                  </button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            {activeTab === "details" ? (
              isLoadingDetails ? (
                <div className="space-y-8">
                  {/* Loading states with smoother animations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-xl animate-pulse h-32" />
                    <div className="bg-gray-800/50 p-6 rounded-xl animate-pulse h-32" />
                  </div>
                  <div className="space-y-6">
                    <div className="h-5 bg-gray-800/50 rounded-full animate-pulse w-32" />
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Main Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group bg-gray-800/30 hover:bg-gray-800/50 p-6 rounded-xl transition-all duration-200 border border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <Coins className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Wager Amount</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            {formatStakeAmount(stakeDetails?.stake_amount)} APT
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-800/50 p-6 rounded-xl transition-all duration-200 border border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform duration-200">
                          <ListChecks className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Total Picks</p>
                          <p className="text-2xl font-bold text-white mt-1">{stakeDetails?.total_picks}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Timeline</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-200">Wager Created</p>
                          <p className="text-sm text-gray-500 mt-1">by {formatAddress(stake.creator)}</p>
                        </div>
                      </div>

                      {stakeDetails?.pairer_addr && (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-200">
                              Paired by {formatAddress(stakeDetails?.pairer_addr)}
                            </p>
                          </div>
                        </div>
                      )}

                      {stakeDetails?.winner_addr && (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-200">
                              Winner: {formatAddress(stakeDetails?.winner_addr)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pair ID Section */}
                  <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <span className="text-sm font-medium text-gray-400">Pair ID</span>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <code className="bg-gray-900/50 px-4 py-2 rounded-lg text-sm text-amber-500 font-mono flex-1 sm:flex-none overflow-x-auto">
                          {stake.pair_id}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                          title={copied ? "Copied!" : "Copy to clipboard"}
                        >
                          {copied ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {isLoadingMatches
                  ? // Loading state for matches
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-xl overflow-hidden animate-pulse">
                        <div className="bg-gray-800/50 px-6 py-4">
                          <div className="flex justify-between items-center">
                            <div className="w-32 h-5 bg-gray-700 rounded-full" />
                            <div className="w-24 h-5 bg-gray-700 rounded-full" />
                          </div>
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="flex justify-between items-center gap-4">
                            <div className="w-32 h-6 bg-gray-700 rounded-full" />
                            <div className="w-8 h-6 bg-gray-700 rounded-full" />
                            <div className="w-32 h-6 bg-gray-700 rounded-full" />
                          </div>
                          <div className="w-40 h-5 bg-gray-700 rounded-full" />
                        </div>
                      </div>
                    ))
                  : selectedMatches?.map((match) => (
                      <div
                        key={match.matchId}
                        className="group bg-gray-800/30 hover:bg-gray-800/40 rounded-xl overflow-hidden transition-all duration-200 border border-gray-700/50"
                      >
                        {/* League Header */}
                        <div className="bg-gray-800/50 px-6 py-4 flex items-center justify-between border-b border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                              <Trophy className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-200">{match.league}</span>
                          </div>
                          <span className="text-sm text-gray-400 font-medium">Match #{match.matchId}</span>
                        </div>

                        {/* Match Details */}
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
                            <div className="text-center sm:flex-1">
                              <p className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                                {match.homeTeam}
                              </p>
                            </div>
                            <div className="px-4">
                              <span className="text-amber-500 font-bold text-xl">vs</span>
                            </div>
                            <div className="text-center sm:flex-1">
                              <p className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                                {match.awayTeam}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <Timer className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-300 font-medium">{formatMatchesTimestamp(match.matchTime)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={isUnstakeDialogOpen} onOpenChange={setIsUnstakeDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg border border-gray-700 bg-gray-900">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center text-lg text-amber-500">Remove Wager</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Wager Amount:</span>
                <span className="font-semibold text-white">{stake.amount} APT</span>
              </div>
            </div>
            <DialogDescription>
              Are you sure you want to remove this wager ? This action cannot be undone.
            </DialogDescription>
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
            <Button
              variant="destructive"
              onClick={handleConfirmUnstake}
              disabled={isUnstakeLoading}
              className="w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300"
            >
              {isUnstakeLoading ? <SpinButton /> : "Confirm "}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
