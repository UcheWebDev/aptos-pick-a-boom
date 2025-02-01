// MatchBetting.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Timer, Info, CheckCircle2, Loader2, BookText, RefreshCw, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import SelectionDialog from "@/components/SelectionDialog";

import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { supabase } from "@/lib/supabase";
import { confirmFunc } from "@/entry-functions/confirmFunc";
import { aptosClient } from "@/utils/aptosClient";
import { Match, Selection, ExistingSelection, getResultText } from "../types/types";
import MatchCard from "@/components/MatchCard";
import MatchResults from "@/components/MatchResults";
import { CustomLoader } from "@/components/CustomLoader";

export default function MatchBetting() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [existingSelections, setExistingSelections] = useState<ExistingSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStakeCompleted, setIsStakeCompleted] = useState(false);
  const [marketType, setMarketType] = useState("outcome"); // New state for market type
  const [resultData, setResultData] = useState(null);

  const { connected, account, signAndSubmitTransaction } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  // Rest of your existing functions (toggleSelection, saveSelections, completeStake, etc.)
  // Make sure to update them to handle the new market type
  const toggleSelection = (
    matchId: string,
    prediction: "home" | "draw" | "away" | "over" | "under",
    homeTeam: string,
    awayTeam: string,
  ) => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.matchId === matchId);

      // If this match already has a selection
      if (exists) {
        // If clicking the same prediction, remove it
        if (exists.prediction === prediction) {
          return prev.filter((s) => s.matchId !== matchId);
        }
        // If clicking a different prediction, update it
        return prev.map((s) => (s.matchId === matchId ? { ...s, prediction } : s));
      }

      // Add new selection
      return [...prev, { matchId, prediction, homeTeam, awayTeam }];
    });
  };

  const handleMarketTypeChange = (newMarketType: string) => {
    setMarketType(newMarketType);
    setSelections([]); // Clear selections when changing market type
  };

  const getResultText = (prediction: "home" | "draw" | "away", homeTeam: string, awayTeam: string) => {
    switch (prediction) {
      case "home":
        return `${homeTeam} Win`;
      case "draw":
        return "Draw";
      case "away":
        return `${awayTeam} Win`;
    }
  };

  // Save selections to Supabase
  const saveSelections = async () => {
    // Prevent multiple simultaneous submissions
    if (isSaving) return;

    try {
      setIsSaving(true);

      const { data: stakeData, error: stakeError } = await supabase
        .from("stakes")
        .select("total_picks")
        .eq("stake_id", Number(id))
        .single();

      if (stakeError) {
        throw new Error("Failed to fetch Wager information");
      }

      // Validate number of selections
      if (selections.length !== stakeData.total_picks) {
        toast({
          title: "Invalid Selection Count",
          description: `You must make exactly ${stakeData.total_picks} prediction${stakeData.total_picks > 1 ? "s" : ""}. You currently have ${selections.length}.`,
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-states`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_matches: selections.map((s) => s.matchId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify match states");
      }

      const stateCheck = await response.json();

      if (!stateCheck.valid) {
        toast({
          title: "Cannot Save Predictions",
          description: `${stateCheck.invalidCount} match${stateCheck.invalidCount > 1 ? "es have" : " has"} already started or finished. Please refresh and try again.`,
          variant: "destructive",
        });
        return;
      }
      const selectionsToSave = selections.map((selection) => ({
        match_id: selection.matchId,
        prediction: selection.prediction,
        homeTeam: selection.homeTeam,
        awayTeam: selection.awayTeam,
        address: account?.address,
        stake_id: id,
      }));

      // Simulate network delay (optional)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const { data, error } = await supabase.from("selections").insert(selectionsToSave);

      if (error) {
        throw error;
      }

      // Show success toast
      toast({
        title: "Success",
        description: `${selections.length} prediction(s) saved successfully!`,
      });
      setSelections([]);
      setShowPredictionsModal(false);

      // Navigate to bet confirmation or next page
      navigate("/super-picks");
    } catch (error: any) {
      // Show error toast
      toast({
        title: "Error",
        description: `Failed to save predictions: ${error.message}`,
      });
      console.error("Selection save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchMatchesAndSelections = async () => {
      try {
        setLoading(true);
        const { data: stakeData, error: stakeError } = await supabase
          .from("stakes")
          .select("selected_matches, is_completed")
          .eq("stake_id", Number(id))
          .single();

        if (stakeError) {
          throw new Error("Failed to fetch Wager data");
        }

        if (stakeData?.is_completed) {
          const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-results`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stake_id: Number(id),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to check match results");
          }

          const result = await response.json();
          setResultData(result);
          setIsStakeCompleted(true);
        }

        // setIsStakeCompleted(!!stakeData?.is_completed);

        if (!stakeData?.selected_matches || !stakeData.selected_matches.length) {
          setMatches([]);
          return;
        }

        const { data: matchesData, error: matchesError } = await supabase
          .from("matches")
          .select("*")
          .in("matchId", stakeData.selected_matches);

        if (matchesError) throw matchesError;

        const { data: selectionsData, error: selectionsError } = await supabase
          .from("selections")
          .select("match_id, prediction")
          .eq("stake_id", Number(id))
          .eq("address", account?.address)
          .in(
            "match_id",
            matchesData.map((match) => match.matchId),
          );

        if (selectionsError) throw selectionsError;

        setMatches(matchesData);
        setExistingSelections(selectionsData || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (account?.address) {
      fetchMatchesAndSelections();
    }
  }, [account]);

  const completeStake = async () => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);

      // Check if stake exists and isn't already completed
      const { data: stakeData, error: stakeError } = await supabase
        .from("stakes")
        .select("is_completed")
        .eq("stake_id", Number(id))
        .single();

      if (stakeError) {
        throw new Error("Wager not found");
      }

      // Check if Wager is already completed
      if (stakeData.is_completed) {
        setIsStakeCompleted(true);
        toast({
          title: "Notice",
          description: "This Wager has already been completed.",
        });
        return;
      }

      // Call the check-results endpoint
      const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stake_id: Number(id),
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

      // Submit the transaction with the winning address
      const committedTransaction = await signAndSubmitTransaction(confirmFunc(id, result.winner));
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      // Update the Wager status in the database
      const { error: updateError } = await supabase
        .from("stakes")
        .update({
          winner_addr: result.winner,
          is_completed: true,
        })
        .eq("stake_id", Number(id));

      if (updateError) {
        throw new Error("Failed to update Wager winner");
      }

      setIsStakeCompleted(true);

      toast({
        title: "Success",
        description: result.message,
      });
      setResultData(result);

      // navigate(`/Wager/${id}/results`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to complete Wager: ${error}`,
        variant: "destructive",
      });
      console.error("Complete Wager error:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const checkPredictionResult = (
    match: Match,
    prediction: "home" | "draw" | "away",
  ): "correct" | "incorrect" | null => {
    // If match is not finished, return null
    if (!match.finished) return null;
    if (match.homeScore === undefined || match.awayScore === undefined) return null;
    let matchOutcome: "home" | "draw" | "away";
    if (match.homeScore > match.awayScore) {
      matchOutcome = "home";
    } else if (match.homeScore < match.awayScore) {
      matchOutcome = "away";
    } else {
      matchOutcome = "draw";
    }
    return prediction === matchOutcome ? "correct" : "incorrect";
  };

  // Function to check if a match has an existing selection
  const getExistingSelection = (
    match: Match,
  ): {
    prediction: "home" | "draw" | "away" | null;
    result: "correct" | "incorrect" | null;
  } => {
    console.log("selected match", match);

    const existingSelection = existingSelections?.find((sel) => sel.match_id === String(match.matchId));

    return {
      prediction: existingSelection ? existingSelection.prediction : null,
      result: existingSelection ? checkPredictionResult(match, existingSelection.prediction) : null,
    };
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header section remains the same */}
      <div className="bg-gray-900 text-white sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              {/* Left side with back button and title */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Link to="/" className="flex items-center text-white hover:text-blue-200">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">Back</span>
                </Link>
                <h1 className="text-lg font-bold">Match Predictions</h1>
              </div>

              {/* Right side with action buttons */}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Type Toggle */}
        <div className="mb-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleMarketTypeChange("outcome")}
              className={`px-4 py-2 rounded-lg ${
                marketType === "outcome" ? "bg-amber-500 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              Outcome
            </button>
            <button
              onClick={() => handleMarketTypeChange("goals")}
              className={`px-4 py-2 rounded-lg ${
                marketType === "goals" ? "bg-amber-500 text-gray-900" : "bg-gray-800 text-gray-400"
              }`}
            >
              Over/Under
            </button>
          </div>
        </div>

        {/* Main content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CustomLoader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : isStakeCompleted ? (
          <MatchResults data={resultData} />
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500">No matches found for today.</div>
        ) : (
          <div className="space-y-8">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                marketType={marketType}
                existingSelection={getExistingSelection(match)}
                currentSelections={selections}
                onSelect={toggleSelection}
                result={checkPredictionResult(
                  match,
                  existingSelections.find((sel) => sel.match_id === match.matchId)?.prediction,
                )}
              />
            ))}

            <div className="flex flex-wrap items-center justify-end gap-2 w-full mt-10">
              <button
                onClick={completeStake}
                disabled={isCompleting}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
              >
                {isCompleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trophy className="h-4 w-4 mr-2" />}
                <span className="whitespace-nowrap">Complete</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected Matches Counter */}
        {selections.length > 0 && (
          <div className="fixed bottom-4 left-0 right-0 mx-4 z-50">
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
              <span className="font-semibold">
                {selections.length} {selections.length === 1 ? "Prediction" : "Predictions"} Made
              </span>
              <Button
                onClick={() => setShowPredictionsModal(true)}
                className="bg-white text-amber-500 hover:bg-gray-100"
              >
                View
              </Button>
            </div>
          </div>
        )}

        {/* Predictions Modal remains mostly the same, just update to handle new market type */}
        <SelectionDialog
          open={showPredictionsModal}
          onOpenChange={setShowPredictionsModal}
          selections={selections}
          marketType={marketType}
          isSaving={isSaving}
          onSave={saveSelections}
        />
      </div>
    </div>
  );
}
