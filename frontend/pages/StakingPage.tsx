import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Calculator,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Aperture,
  Clock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useAptosPriceConverter } from "../hooks/useAptosPriceConverter";
import { useAptosBalance } from "@/hooks/useAptosBalance";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";

import { stakeFunc } from "@/entry-functions/stakeFunc";
import SpinButton from "@/components/SpinButton";
import FixturesSelection from "@/components/FixturesSelection";
import { formatStakeAmount } from "@/utils/stakeUtils";

const presetAmounts = [1, 5, 10, 15];
const cutPresets = [
  { label: "Cut 1", multiplier: 1, stakeMultiplier: 1.2 },
  { label: "Cut 2", multiplier: 2, stakeMultiplier: 1.5 },
  { label: "Cut 3", multiplier: 3, stakeMultiplier: 2.0 },
];

export default function BettingForm() {
  const [amount, setAmount] = useState<string>("");
  const [totalGames, setTotalGames] = useState<string>("");
  const [isUsdMode, setIsUsdMode] = useState(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isLoading, setisLoading] = useState(false);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [fetchMatchesError, setFetchMatchesError] = useState(null);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [currentSelectedMatches, setCurrentSelectedMatches] = useState([]); // Add this state

  const [isMatchesDialogOpen, setIsMatchesDialogOpen] = useState(false);

  const [txHash, settxHash] = useState("");
  const [selectedCutPreset, setSelectedCutPreset] = useState<number | null>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errors, setErrors] = useState<{ amount?: string; totalGames?: string; time?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { connected, account, signAndSubmitTransaction } = useWallet();
  const { formattedBalance, isLoading: balanceLoading, isError: balanceError } = useAptosBalance(account);
  const { aptosToUsd, usdToAptos, loading: priceLoading, error: priceError } = useAptosPriceConverter();

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleTotalGamesChange = (value: string) => {
    setTotalGames(value);
    setErrors((prev) => ({ ...prev, totalGames: undefined }));
  };
  const generateUniquePairId = async () => {
    while (true) {
      const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // Generate a 4-digit number
      const pairId = `PICK${randomNumber}`; // Combine the prefix "GAME" with the random number
      const { data: existingStake, error } = await supabase
        .from("stakes")
        .select("pair_id")
        .eq("pair_id", pairId)
        .single();
      if (error || !existingStake) {
        return pairId;
      }
    }
  };

  const toggleCurrency = () => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (isUsdMode) {
        const aptosAmount = usdToAptos(numAmount);
        setAmount(aptosAmount ? aptosAmount.toFixed(6) : "");
      } else {
        const usdAmount = aptosToUsd(numAmount);
        setAmount(usdAmount ? usdAmount.toFixed(2) : "");
      }
    }
    setIsUsdMode(!isUsdMode);
  };

  const getDisplayAmount = (value: number): string => {
    if (isUsdMode) {
      const usdAmount = aptosToUsd(value);
      return usdAmount ? `$${usdAmount.toFixed(2)}` : "...";
    }
    return `${value} APT`;
  };

  const openMatchesDialog = () => {
    setIsMatchesDialogOpen(true);
  };

  const calculatePotentialWinnings = (baseAmount: number | string): number => {
    const numAmount = typeof baseAmount === "string" ? parseFloat(baseAmount) : baseAmount;

    // Otherwise use the regular multiplier
    return numAmount * 2;
  };

  const getFormattedPotentialWinnings = (): string => {
    const numAmount = parseFloat(amount || "0");
    if (numAmount === 0) return "0";

    const potentialWinnings = calculatePotentialWinnings(numAmount);

    if (isUsdMode) {
      const aptWinnings = usdToAptos(potentialWinnings);
      return `${aptWinnings.toFixed(6)} APT`;
    }

    const usdWinnings = aptosToUsd(potentialWinnings);
    return usdWinnings ? `$${usdWinnings.toFixed(2)}` : "...";
  };

  const isValidTime = (timeStr: string, matchTime: string): boolean => {
    if (!timeStr) return false;

    const [matchDay, matchMonth, matchYear, matchHour, matchMinute] = matchTime.split(/[.: ]/);
    const matchDate = new Date(
      parseInt(matchYear),
      parseInt(matchMonth) - 1,
      parseInt(matchDay),
      parseInt(matchHour),
      parseInt(matchMinute),
    );

    const [hours, minutes] = timeStr.split(":");
    const selectedDate = new Date();
    selectedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Ensure bet is placed at least 15 minutes before match time
    const timeDiff = matchDate.getTime() - selectedDate.getTime();
    return timeDiff >= 15 * 60 * 1000; // 15 minutes in milliseconds
  };

  // Update validateForm function to include match selection validation
  const validateForm = () => {
    const newErrors: { amount?: string; totalGames?: string } = {};

    // Amount validation
    const numAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Please enter a stake amount";
    } else if (isUsdMode) {
      const aptosEquivalent = usdToAptos(numAmount);
      if (!aptosEquivalent || aptosEquivalent < 0.1) {
        newErrors.amount = "Minimum stake amount is 0.1 APT";
      }
    } else if (numAmount < 0.1) {
      newErrors.amount = "Minimum stake amount is 0.1 APT";
    }

    // Match selection validation
    if (selectedMatches.length === 0) {
      newErrors.totalGames = "Please select at least one match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (isUsdMode) {
        const aptosAmount = usdToAptos(parseFloat(amount));
        if (aptosAmount) {
          setAmount(aptosAmount.toFixed(6));
        }
      }
      setIsConfirmDialogOpen(true);
    }
  };

  const cancelHandleConfirmBet = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmBet = async () => {
    if (!account) return;
    try {
      setisLoading(true);
      setIsProcessingTransaction(true); // Set processing state to true

      const response = await fetch(`https://juipkpvidlthunyyeplg.supabase.co/functions/v1/webhook/check-states`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_matches: selectedMatches.map((s) => s.matchId),
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
        setisLoading(false);
        setIsProcessingTransaction(false);
        return;
      }

      const pairId = await generateUniquePairId();
      const amountInOctas = Math.floor(parseFloat(amount) * 100000000);
      const committedTransaction = await signAndSubmitTransaction(
        stakeFunc(amountInOctas, selectedCutPreset, totalGames, pairId),
      );
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      const { data: stakeData, error: stakeError } = await supabase.from("stakes").insert({
        creator_addr: account.address,
        stake_amount: amountInOctas,
        transaction_hash: executedTransaction.hash,
        stake_status: "created",
        total_cut: selectedCutPreset,
        total_picks: parseInt(totalGames),
        pair_id: pairId,
        selected_matches: selectedMatches.map((match) => match.matchId), // Add selected matches
      });
      if (stakeError) {
        toast({
          title: "Error",
          description: `Error recording stake to DB`,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["stake-bet"],
      });
      settxHash(executedTransaction.hash);
      setisLoading(false);
      setIsConfirmDialogOpen(false);
      setIsSuccessDialogOpen(true);
      setAmount("");
      setTotalGames("");
      setMultiplier(1.5);
      setSelectedCutPreset(0);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving wager !",
        description: `${error}`,
        variant: "destructive",
      });
      setisLoading(false);
    } finally {
      setIsProcessingTransaction(false);
    }
  };

  const formatAmount = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `${numValue.toFixed(6)} APT`;
  };

  const handleCutPresetToggle = (index: number) => {
    setSelectedCutPreset(index);
  };

  const truncateHash = (hash) => {
    if (!hash) return "";
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  const isMatchCurrentDate = (matchTime: string, currentDate: Date): boolean => {
    // Parse match time
    const [day, month, year] = matchTime.split(" ")[0].split(".");
    const matchDate = new Date(`${year}-${month}-${day}`);

    // Compare date components
    return (
      matchDate.getDate() === currentDate.getDate() &&
      matchDate.getMonth() === currentDate.getMonth() &&
      matchDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const fetchTotalCount = async () => {
    try {
      // Reset state
      setMatchesLoading(true);
      setFetchMatchesError(null);
      const currentDateTime = new Date();

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*", { count: "exact" }) // Use exact count
        .in("ccode", ["FRA", "ESP", "ENG", "GER", "ITA", "TUR"]);

      if (matchesError) throw matchesError;

      // Filter matches based on current date
      const filteredMatchCount = matchesData.filter((match) =>
        isMatchCurrentDate(match.matchTime, currentDateTime),
      ).length;

      const filteredTodayMatch = matchesData.filter((match) => match);

      const filteredNotStartedMatch = filteredTodayMatch.filter(
        (match) => match.started == false && match.finished == false && match.cancelled == false,
      );
      const matchCnt = filteredTodayMatch.filter(
        (match) => match.started == false && match.finished == false && match.cancelled == false,
      ).length;
      // Set the item count
      setTodaysMatches(filteredNotStartedMatch);
      setMatchesCount(matchCnt);
      setMatchesLoading(false);
    } catch (err) {
      console.error("Error fetching match count:", err);
      setFetchMatchesError(err.message);
      setMatchesLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalCount();
  }, []);

  return (
    <div className="">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        {/* Balance Display */}
        {connected ? (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm text-gray-500"> {formattedBalance} APT</span>
              </div>
              {!priceLoading && !priceError && (
                <span className="text-sm text-gray-500">(${aptosToUsd(parseFloat(formattedBalance))?.toFixed(2)})</span>
              )}
            </div>
          </div>
        ) : null}

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Stake Amount</label>
            <button onClick={toggleCurrency} className="text-sm text-amber-500 hover:text-amber-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Switch to {isUsdMode ? "APT" : "USD"}
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {isUsdMode ? "$" : "APT"}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 text-white bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 ${
                errors.amount ? "border-red-500" : ""
              }`}
              placeholder={`Total amount in ${isUsdMode ? "USD" : "APT"}`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.amount}
            </p>
          )}

          {/* Preset Amounts */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => handleAmountChange(preset.toString())}
                className="px-2 py-1 text-sm bg-gray-800/50 text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
              >
                {getDisplayAmount(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Total Picks</label>
            <button
              onClick={openMatchesDialog}
              className="text-sm text-amber-500 hover:text-amber-600 flex items-center"
            >
              available games ({matchesCount})
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Aperture className="h-4 w-4 mr-1" />
            </span>
            <input
              type="number"
              value={totalGames}
              onChange={(e) => handleTotalGamesChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 text-white bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 ${
                errors.totalGames ? "border-red-500" : ""
              }`}
              placeholder="Total number of games"
              readOnly={true}
            />
          </div>
          {errors.totalGames && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.totalGames}
            </p>
          )}
        </div>

        {/* Multiplier Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-400">Flex (coming soon)</label>
          </div>

          {/* Cut Presets */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {cutPresets.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => handleCutPresetToggle(preset.multiplier)}
                disabled={true}
                className={`px-4 py-2 rounded-lg  text-sm font-medium transition-colors ${
                  selectedCutPreset === preset.multiplier
                    ? "bg-blue-600 text-white"
                    : " bg-gray-800/50 text-gray-400 border border-gray-700 rounded hover:bg-gray-700"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-400">
              <Calculator className="h-5 w-5 mr-2" />
              <span>Potential Win</span>
            </div>
            <span className="font-bold text-green-600">{getFormattedPotentialWinnings()}</span>
          </div>
          <div className="text-xs text-gray-400">*Final payout is 1x of wager amount</div>
        </div>

        {/* Place Bet Button */}
        <button
          onClick={handleSubmit}
          disabled={!connected}
          className={`w-full  py-4 rounded-full
           font-bold  transition-colors 
           ${!connected ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 group"}`}
        >
          Place
        </button>
      </div>

      {/* Confirmation Modal */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if not processing transaction
          if (isProcessingTransaction) {
            setIsConfirmDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent className="w-[95%] p-4 sm:p-6 sm:w-full sm:max-w-md rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700">
          <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-center text-lg text-amber-500">Confirm Your Wager</AlertDialogTitle>
            <div className="space-y-4 pt-2">
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span className="text-gray-400">Stake Amount:</span>
                  <span className="text-white font-semibold">{formatAmount(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span className="text-gray-400">Multiplier:</span>
                  <span className="text-white font-semibold">{multiplier.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Potential Win:</span>
                  <span className="font-semibold text-green-600">
                    {formatAmount(calculatePotentialWinnings(amount))}
                  </span>
                </div>
              </div>
              <AlertDialogDescription className="text-xs sm:text-sm text-gray-400 text-center">
                By clicking confirm, you agree to place this wager with the specified parameters.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-4">
            <AlertDialogCancel
              onClick={cancelHandleConfirmBet}
              className="w-full sm:w-1/2 mt-0"
              disabled={isProcessingTransaction}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBet}
              className="w-full sm:w-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
              disabled={isProcessingTransaction}
            >
              {isLoading ? <SpinButton /> : "Confirm Bet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <AlertDialogContent className="w-[95%] p-4 sm:p-6 sm:w-full sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gray-800 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-amber-500">Stake Placed!</AlertDialogTitle>
              <div className="text-center">
                <p className="text-sm text-gray-400 mt-1 truncate" title={txHash}>
                  Transaction hash: {truncateHash(txHash)}
                </p>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600">
                Done
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Matches Dialog */}
      <Dialog open={isMatchesDialogOpen} onOpenChange={setIsMatchesDialogOpen}>
        <DialogContent className="w-[95%] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700">
          <DialogHeader>
            <DialogTitle>{/* Title content */}</DialogTitle>
          </DialogHeader>

          <div className="py-2 sm:py-4 overflow-y-auto">
            <FixturesSelection
              matches={todaysMatches}
              maxAllowedSelections={10}
              alreadySelectedMatches={selectedMatches}
              currentSelection={currentSelectedMatches}
              onSelectionChange={(matches) => {
                setCurrentSelectedMatches(matches);
              }}
            />
          </div>

          <DialogFooter className="flex flex-row space-x-2 mt-4">
            <Button variant="outline" className="w-full sm:w-1/2 " onClick={() => setIsMatchesDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSelectedMatches(currentSelectedMatches);
                setTotalGames(currentSelectedMatches.length.toString());
                setIsMatchesDialogOpen(false);
              }}
              className="w-full sm:w-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
