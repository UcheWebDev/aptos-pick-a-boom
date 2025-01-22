import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, Eye, Loader2, CheckCircle, Check, Copy, Coins, Users, BookCheck, Trophy } from "lucide-react";
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
        throw new Error("Failed to fetch stake matches");
      }

      if (!stakeDt.selected_matches || stakeDt.selected_matches.length === 0) {
        throw new Error("No matches selected for this stake");
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
      //     title: "Cannot Pair Stake",
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
          description: `Error recording stake to DB`,
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
        throw new Error("Stake not found");
      }

      if (stakeData.is_completed) {
        toast({
          title: "Notice",
          description: "This stake has already been completed.",
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
          title: "Cannot Complete Stake",
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
        throw new Error("Failed to update stake winner");
      }
      toast({
        title: "Success",
        description: result.message + ` Transaction hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error("Error completing stake:", error);
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
        description: "Stake has been successfully unstaked",
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
          ${activeTab === tab ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 mb-6">
      {/* Header Section */}
      <div className=" p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <CircleUserRound className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Creator</p>
              <p className="text-gray-800 font-semibold">{formatAddress(stake.creator)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-gray-500">Stake #{stake.id}</span>
            <span
              className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                stake.status === "Open" || stake.status === "Completed"
                  ? "bg-green-100 border border-green-700 text-green-700"
                  : stake.status === "Paired"
                    ? "bg-blue-100 border border-blue-700 text-blue-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {stake.status}
            </span>
          </div>
        </div>
      </div>
      {/* <div>
        <p>{stake.createdAt}</p>
      </div> */}

      <div className="p-4 space-y-4">
        {/* Amount Section */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Stake Amount</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-800">{stake.amount}</span>
            <span className="text-sm font-medium text-gray-500">APT</span>
          </div>
        </div>
        <div className="">
          {/* <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Lock Time</p>
              <p className="text-sm font-medium">{stake.selectedTime || "N/A"}</p>
            </div>
          </div> */}
          {/* <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Total Pairs</p>
              <p className="text-sm font-medium">{stake.totalPairs || "0"}</p>
            </div>
          </div> */}
        </div>

        <div className="flex gap-2 pt-2">
          {isUserAuthorizedToComplete && !isPaired && !isCompleted ? (
            <>
              <button
                onClick={() => setIsDetailsDialogOpen(true)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                View Details
              </button>
              <button
                onClick={() => onUnstakeStake()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-full font-medium transition-colors hover:bg-red-700 shadow-sm hover:shadow"
              >
                Unstake
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsDetailsDialogOpen(true)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                View Details
              </button>
              {isOpen && (
                <button
                  onClick={handleSubmit}
                  disabled={!authorizedUser?.address || authorizedUser?.address === stake.creator}
                  className={`flex-1 px-4 py-2.5 rounded-full font-medium transition-all duration-200 ${
                    !authorizedUser?.address || authorizedUser?.address === stake.creator
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                  }`}
                >
                  {isLoading ? <SpinButton /> : "Pair Stake"}
                </button>
              )}
              {isPaired && isUserAuthorizedToComplete && (
                <button
                  onClick={onCompleteStake}
                  disabled={isCompleting}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-full transition-colors"
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-4 w-4 mr-2" />
                  )}
                  <span className="whitespace-nowrap">Complete Stake</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={isPairDialogOpen} onOpenChange={setIsPairDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Confirm Your Stake Pair</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Stake Amount:</span>
                <span className="font-semibold">{stake.amount} APT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Creator:</span>
                <span className="font-semibold">{formatAddress(stake.creator)}</span>
              </div>
            </div>
            <DialogDescription>
              By clicking confirm, you agree to pair this stake with the specified amount.
            </DialogDescription>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button variant="outline" onClick={() => setIsPairDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-900" onClick={handleConfirmPair} disabled={isLoading}>
              {isLoading ? <SpinButton /> : "Confirm Pair"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto text-center rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <DialogTitle>Pairing Complete!</DialogTitle>
          <DialogDescription>Transaction hash: {txHash ? truncateHash(txHash) : ""}</DialogDescription>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => navigateToMatchesPage()} className="w-full sm:w-auto bg-blue-900">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] w-[90%] rounded-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Wager Details</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stake.status === "Open" || stake.status === "Completed"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-blue-100 text-blue-700 border border-blue-300"
                }`}
              >
                {stake.status}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex space-x-2 border-b pb-4">
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
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Created By</p>
                      <p className="font-medium text-gray-900">{formatAddress(stake.creator)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">{stake.amount} APT</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Cut</p>
                        <p className="text-lg font-semibold text-gray-900">{stakeDetails.total_cut}</p>
                      </div>
                      <div className="bg-white p-2 rounded-full">
                        <Coins className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Picks</p>
                        <p className="text-lg font-semibold text-gray-900">{stakeDetails.total_picks}</p>
                      </div>
                      <div className="bg-white p-2 rounded-full">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Stake Created</p>
                        {/* <p className="text-sm text-gray-500">{formatDate(stakeDetails.created_at)}</p> */}
                      </div>
                    </div>

                    {stakeDetails.pairer_addr && (
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Paired by {formatAddress(stakeDetails.pairer_addr)}
                          </p>
                          <p className="text-sm text-gray-500">Stake was paired</p>
                        </div>
                      </div>
                    )}

                    {stakeDetails.winner_addr && (
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <BookCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Wager completed</p>
                          <p className="text-sm text-gray-500">Winner is {formatAddress(stakeDetails.winner_addr)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pair ID</span>
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
                  <div key={match.matchId} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Match #{match.matchId}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Teams</p>
                        <p className="text-sm font-medium text-gray-900">
                          {match.homeTeam} vs {match.awayTeam}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium text-gray-900">{match.matchTime}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No matches selected for this stake</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={isUnstakeDialogOpen} onOpenChange={setIsUnstakeDialogOpen}>
        <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Confirm Unstake</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Stake Amount:</span>
                <span className="font-semibold">{stake.amount} APT</span>
              </div>
            </div>
            <DialogDescription>Are you sure you want to unstake? This action cannot be undone.</DialogDescription>
          </div>
          <DialogFooter className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUnstakeDialogOpen(false)}
              disabled={isUnstakeLoading}
              className="w-auto"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnstake} disabled={isUnstakeLoading} className="w-auto">
              {isUnstakeLoading ? <SpinButton /> : "Confirm Unstake"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
