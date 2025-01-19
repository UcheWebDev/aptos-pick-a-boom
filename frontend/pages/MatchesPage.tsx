import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ArrowLeft, Timer, Info, CheckCircle2, Loader2, Check, X, BookText, RefreshCw, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Flag from "../components/Flag";
import { supabase } from "@/lib/supabase";
import Modal from "../components/Modal";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { confirmFunc } from "@/entry-functions/confirmFunc";
import { aptosClient } from "@/utils/aptosClient";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

type Match = {
  id: string;
  matchId: string;
  matchTime: string;
  league: string;
  ccode: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  live: boolean;
  started: boolean;
  finished: boolean;
  cancelled: boolean;
  homeScore?: number;
  awayScore?: number;
};

type Selection = {
  matchId: string;
  prediction: "home" | "draw" | "away";
  homeTeam: string;
  awayTeam: string;
};

type ExistingSelection = {
  match_id: string;
  prediction: "home" | "draw" | "away";
};

export default function MatchBetting() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [existingSelections, setExistingSelections] = useState<ExistingSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStakeCompleted, setIsStakeCompleted] = useState(false);
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // URL path parameter

  const toggleSelection = (
    matchId: string,
    prediction: "home" | "draw" | "away",
    homeTeam: string,
    awayTeam: string,
  ) => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.matchId === matchId);
      if (exists) {
        if (exists.prediction === prediction) {
          return prev.filter((s) => s.matchId !== matchId);
        }
        return prev.map((s) => (s.matchId === matchId ? { matchId, prediction, homeTeam, awayTeam } : s));
      }
      return [...prev, { matchId, prediction, homeTeam, awayTeam }];
    });
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
        throw new Error("Failed to fetch stake information");
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

      // If any matches are invalid (started/finished/cancelled), prevent saving
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
          throw new Error("Failed to fetch stake data");
        }

        setIsStakeCompleted(!!stakeData?.is_completed);

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

  const refreshScores = async () => {};

  // const completeStake = async () => {
  //   if (isCompleting) return;

  //   try {
  //     setIsCompleting(true);

  //     // Check if stake exists
  //     const { data: stakeData, error: stakeError } = await supabase
  //       .from("stakes")
  //       .select("creator_addr, pairer_addr, is_completed")
  //       .eq("stake_id", Number(id))
  //       .single();

  //     if (stakeError) {
  //       throw new Error("Stake not found");
  //     }

  //     if (stakeData.is_completed) {
  //       setIsStakeCompleted(true);
  //       toast({
  //         title: "Notice",
  //         description: "This stake has already been completed.",
  //       });
  //       return;
  //     }

  //     // Get all selections for this stake
  //     const { data: selectionsData, error: selectionsError } = await supabase
  //       .from("selections")
  //       .select("match_id, prediction")
  //       .eq("stake_id", Number(id));

  //     if (selectionsError) {
  //       throw new Error("Failed to fetch selections");
  //     }

  //     // Get match results
  //     const matchIds = selectionsData.map((s) => s.match_id);

  //     const { data: matchesData, error: matchesError } = await supabase
  //       .from("matches")
  //       .select("id, homeScore, awayScore")
  //       .in("id", matchIds);

  //     if (matchesError) {
  //       throw new Error("Failed to fetch match results");
  //     }

  //     // Calculate correct predictions
  //     let correctPredictions = 0;
  //     const totalPredictions = selectionsData.length;

  //     selectionsData.forEach((selection) => {
  //       const match = matchesData.find((m) => m.id === selection.match_id);
  //       if (match && match.homeScore !== null && match.awayScore !== null) {
  //         let actualResult;
  //         if (match.homeScore > match.awayScore) {
  //           actualResult = "home";
  //         } else if (match.homeScore < match.awayScore) {
  //           actualResult = "away";
  //         } else {
  //           actualResult = "draw";
  //         }

  //         if (selection.prediction === actualResult) {
  //           correctPredictions++;
  //         }
  //       }
  //     });

  //     // Determine winner
  //     const winningAddress = correctPredictions > totalPredictions / 2 ? stakeData.pairer_addr : stakeData.creator_addr;

  //     // Update stake with winner
  //     const { error: updateError } = await supabase
  //       .from("stakes")
  //       .update({
  //         winner_addr: winningAddress,
  //         is_completed: true,
  //       })
  //       .eq("stake_id", Number(id));

  //     if (updateError) {
  //       throw new Error("Failed to update stake winner");
  //     }

  //     setIsStakeCompleted(true);

  //     toast({
  //       title: "Success",
  //       description: `Stake completed successfully! Winner determined.`,
  //     });

  //     // Redirect to results page
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: `Failed to complete stake: ${error.message}`,
  //       variant: "destructive",
  //     });
  //     console.error("Complete stake error:", error);
  //   } finally {
  //     setIsCompleting(false);
  //   }
  // };

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
        throw new Error("Stake not found");
      }

      // Check if stake is already completed
      if (stakeData.is_completed) {
        setIsStakeCompleted(true);
        toast({
          title: "Notice",
          description: "This stake has already been completed.",
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
          title: "Cannot Complete Stake",
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

      // Update the stake status in the database
      const { error: updateError } = await supabase
        .from("stakes")
        .update({
          winner_addr: result.winner,
          is_completed: true,
        })
        .eq("stake_id", Number(id));

      if (updateError) {
        throw new Error("Failed to update stake winner");
      }

      setIsStakeCompleted(true);

      toast({
        title: "Success",
        description: result.message,
      });

      // navigate(`/stake/${id}/results`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to complete stake: ${error}`,
        variant: "destructive",
      });
      console.error("Complete stake error:", error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white sticky top-0 z-10">
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
                <h1 className="text-lg sm:text-xl font-bold">Match Predictions</h1>
              </div>

              {/* Right side with action buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Refresh Button - Full width on mobile, auto on larger screens */}
                {/* <button
                  onClick={refreshScores}
                  disabled={isRefreshing}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  <span className="whitespace-nowrap">Refresh Scores</span>
                </button> */}

                {/* Complete Stake Button - Full width on mobile, auto on larger screens */}
                <button
                  onClick={completeStake}
                  disabled={isCompleting}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-4 w-4 mr-2" />
                  )}
                  <span className="whitespace-nowrap">Complete Stake</span>
                </button>

                {/* Predictions Button */}
                {selections.length > 0 && (
                  <button
                    onClick={() => setShowPredictionsModal(true)}
                    className="flex items-center justify-center px-4 py-2 hover:bg-blue-600 rounded-md transition-colors w-full sm:w-auto"
                  >
                    <BookText className="h-5 w-5 mr-2" />
                    <span className="whitespace-nowrap">View Selections</span>
                    <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {selections.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          // Error State
          <div className="text-center text-red-500">Error: {error}</div>
        ) : isStakeCompleted ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-76px)]">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Stake Completed</h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              This stake has been completed and the results have been finalized.
            </p>
            <Link
              to="/super-picks"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Super Picks
            </Link>
          </div>
        ) : matches.length === 0 ? (
          // No Matches State
          <div className="text-center text-gray-500">No matches found for today.</div>
        ) : (
          // Matches List
          <div className="space-y-4">
            {matches.map((match) => {
              const { prediction: existingSelection, result } = getExistingSelection(match);
              const renderMatchState = () => {
                if (match.cancelled) {
                  return <div className="text-red-500 text-sm font-medium">Match Cancelled</div>;
                }

                if (match.started && !match.finished) {
                  return (
                    <span className="flex items-center text-red-500 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                      LIVE
                      {match.homeScore !== undefined && match.awayScore !== undefined && (
                        <span className="ml-2 font-bold">
                          {match.homeScore} - {match.awayScore}
                        </span>
                      )}
                    </span>
                  );
                }

                if (match.finished) {
                  return (
                    <div className="text-green-600 text-sm font-medium">
                      Final Score: {match.homeScore} - {match.awayScore}
                    </div>
                  );
                }

                // Not started and not cancelled
                return (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Timer className="h-4 w-4 mr-1" />
                    {match.matchTime}
                  </div>
                );
              };
              return (
                <div key={match.id} className="bg-white rounded-lg shadow-sm p-4">
                  {/* League & Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Flag ccode={match.ccode} size="sm" className="rounded-sm" />
                      <span className="text-sm font-medium">{match.league}</span>
                    </div>
                    {renderMatchState()}
                  </div>

                  {/* Teams & Predictions */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Home Win */}
                    <button
                      onClick={() =>
                        !existingSelection && toggleSelection(match.matchId, "home", match.homeTeam, match.awayTeam)
                      }
                      disabled={match.started || match.finished || match.cancelled || !!existingSelection}
                      className={`p-3 rounded-lg border transition-colors ${
                        match.started || match.finished || match.cancelled
                          ? "opacity-50 cursor-not-allowed"
                          : selections.find((s) => s.matchId === match.matchId && s.prediction === "home")
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : existingSelection === "home"
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : existingSelection
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <img src={match.homeLogo} alt={match.homeTeam} className="h-6 w-6" />
                        {existingSelection === "home" && (
                          <div className="">
                            {result === "correct" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : result === "incorrect" ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-left">{match.homeTeam}</div>
                    </button>

                    {/* Draw */}
                    <button
                      onClick={() =>
                        !existingSelection && toggleSelection(match.matchId, "draw", match.homeTeam, match.awayTeam)
                      }
                      disabled={match.started || match.finished || match.cancelled || !!existingSelection}
                      className={`p-3 rounded-lg border transition-colors ${
                        match.started || match.finished || match.cancelled
                          ? "opacity-50 cursor-not-allowed"
                          : selections.find((s) => s.matchId === match.matchId && s.prediction === "draw")
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : existingSelection === "draw"
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : existingSelection
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-center mb-2">
                        <span className="font-bold">X</span>
                        {existingSelection === "draw" && (
                          <div className="flex justify-left text-center">
                            {result === "correct" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : result === "incorrect" ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-center">Draw</div>
                    </button>

                    {/* Away Win */}
                    <button
                      onClick={() =>
                        !existingSelection && toggleSelection(match.matchId, "away", match.homeTeam, match.awayTeam)
                      }
                      disabled={match.started || match.finished || match.cancelled || !!existingSelection}
                      className={`p-3 rounded-lg border transition-colors ${
                        match.started || match.finished || match.cancelled
                          ? "opacity-50 cursor-not-allowed"
                          : selections.find((s) => s.matchId === match.matchId && s.prediction === "away")
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : existingSelection === "away"
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : existingSelection
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <img src={match.awayLogo} alt={match.awayTeam} className="h-6 w-6" />
                        {existingSelection === "away" && (
                          <div className="">
                            {result === "correct" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : result === "incorrect" ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-right">{match.awayTeam}</div>
                    </button>
                  </div>

                  {/* Existing Selection Notice */}
                  {/* {existingSelection && (
                    <div className="text-center text-green-600 text-sm mt-2 font-medium">
                      You've already predicted this match
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        )}

        {/* Predictions Modal */}
        <Modal isOpen={showPredictionsModal} onClose={() => setShowPredictionsModal(false)} title="Your Predictions">
          <div className="space-y-4">
            <div className="divide-y">
              {selections.map((selection, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      {selection.homeTeam} vs {selection.awayTeam}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getResultText(selection.prediction, selection.homeTeam, selection.awayTeam)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <button
                onClick={saveSelections}
                disabled={isSaving}
                className={`w-full text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Predictions...
                  </>
                ) : (
                  "Proceed to Bet"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
