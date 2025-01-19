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
      setIsModalOpen(true);
    }
  };

  const handleConfirmBet = async () => {
    setisLoading(true);
    if (!account) {
      setisLoading(false);
      return;
    }
    try {
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

      // If any matches are invalid (started/finished/cancelled), prevent saving
      if (!stateCheck.valid) {
        toast({
          title: "Cannot Save Predictions",
          description: `${stateCheck.invalidCount} match${stateCheck.invalidCount > 1 ? "es have" : " has"} already started or finished. Please refresh and try again.`,
          variant: "destructive",
        });
        setisLoading(false);
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
      setIsModalOpen(false);
      setShowSuccess(true);
      setAmount("");
      setTotalGames("");
      setMultiplier(1.5);
      setSelectedCutPreset(0);
    } catch (error) {
      setisLoading(false);
      console.error(error);
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
      <div className="bg-white rounded-lg p-6">
        {/* Balance Display */}
        {connected ? (
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-500"> {formattedBalance} APT</span>
              </div>
              {!priceLoading && !priceError && (
                <span className="text-sm text-gray-500">(${aptosToUsd(parseFloat(formattedBalance))?.toFixed(2)})</span>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Stake Amount</label>
            <button onClick={toggleCurrency} className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Switch to {isUsdMode ? "APT" : "USD"}
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {isUsdMode ? "$" : "APT"}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-50 transition-colors"
              >
                {getDisplayAmount(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Total Picks</label>
            <button onClick={openMatchesDialog} className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
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
              className={`w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.totalGames ? "border-red-500" : ""
              }`}
              placeholder="Total number of games"
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
            <label className="text-sm font-medium text-gray-700">Flex</label>
          </div>

          {/* Cut Presets */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {cutPresets.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => handleCutPresetToggle(preset.multiplier)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCutPreset === preset.multiplier
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-600">
              <Calculator className="h-5 w-5 mr-2" />
              <span>Potential Win</span>
            </div>
            <span className="font-bold text-green-600">{getFormattedPotentialWinnings()}</span>
          </div>
          <div className="text-xs text-gray-500">*Final payout is 1x of wager amount</div>
        </div>

        {/* Place Bet Button */}
        <button
          onClick={handleSubmit}
          disabled={!connected}
          className={`w-full  py-4 rounded-lg
           font-bold  transition-colors 
           ${!connected ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-900"}`}
        >
          Place Bet
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Your Bet">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Stake Amount:</span>
              <span className="font-semibold">{formatAmount(parseFloat(amount))}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Multiplier:</span>
              <span className="font-semibold">{multiplier.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Potential Win:</span>
              <span className="font-semibold text-green-600">{formatAmount(calculatePotentialWinnings(amount))}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            By clicking confirm, you agree to place this bet with the specified parameters.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBet}
              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-900"
            >
              {isLoading ? <SpinButton /> : " Confirm Bet"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Stake placed !</p>
            <p
              className="text-sm text-gray-600 mt-1 truncate"
              title={txHash} // Show full hash on hover
            >
              Transaction hash: {truncateHash(txHash)}
            </p>{" "}
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </Modal>

      {/* matches Modal */}
      <Modal isOpen={isMatchesDialogOpen} onClose={() => setIsMatchesDialogOpen(false)}>
        <FixturesSelection
          matches={todaysMatches}
          maxAllowedSelections={10}
          alreadySelectedMatches={selectedMatches}
          currentSelection={currentSelectedMatches} // Pass the current selection
          onSelectionChange={(matches) => {
            setCurrentSelectedMatches(matches); // Update the current selection
          }}
        />
        <div className="flex justify-end gap-3 mt-4 px-4 pb-4">
          <button
            onClick={() => setIsMatchesDialogOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setSelectedMatches(currentSelectedMatches); // Update the final selection only on confirm
              setTotalGames(currentSelectedMatches.length.toString());
              setIsMatchesDialogOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-900"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
