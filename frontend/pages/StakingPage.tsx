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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAptosPriceConverter } from "../hooks/useAptosPriceConverter";
import { useAptosBalance } from "@/hooks/useAptosBalance";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

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

const CustomLoader = () => (
  <div className="relative flex items-center justify-center w-16 h-16">
    {/* Gradient spinning ring */}
    <div
      className="absolute w-full h-full border-4 rounded-full animate-spin"
      style={{
        borderColor: "transparent",
        borderTopColor: "#f59e0b", // amber-500
        borderRightColor: "#ec4899", // pink-500
        background: "linear-gradient(to right, #f59e0b, #ec4899)",
        WebkitBackgroundClip: "text",
      }}
    ></div>

    {/* Container with P */}
    <div className="flex items-center justify-center w-10 h-10 from-gray-800 rounded-lg">
      <span className="text-2xl font-bold text-amber-500">P</span>
    </div>
  </div>
);

export default function BettingForm() {
  const [amount, setAmount] = useState<string>("");
  const [totalGames, setTotalGames] = useState<string>("");
  const [isUsdMode, setIsUsdMode] = useState(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [matches, setMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isBettingFormOpen, setIsBettingFormOpen] = useState(false);

  const [isLoading, setisLoading] = useState(false);
  const [isFetching, setisFetching] = useState(true);

  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [fetchMatchesError, setFetchMatchesError] = useState(null);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [currentSelectedMatches, setCurrentSelectedMatches] = useState([]); // Add this state

  const [isMatchesDialogOpen, setIsMatchesDialogOpen] = useState(false);

  const [txHash, settxHash] = useState("");
  const [selectedCutPreset, setSelectedCutPreset] = useState<number | null>(0);
  const [selectedMarketType, setSelectedMarketType] = useState("outcome");

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

  // Update validateForm function to include match selection validation
  const validateForm = () => {
    const newErrors: { amount?: string; totalGames?: string } = {};

    // Amount validation
    const numAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Please enter a Wager amount";
    } else if (isUsdMode) {
      const aptosEquivalent = usdToAptos(numAmount);
      if (!aptosEquivalent || aptosEquivalent < 0.1) {
        newErrors.amount = "Minimum Wager amount is 0.1 APT";
      }
    } else if (numAmount < 0.1) {
      newErrors.amount = "Minimum Wager amount is 0.1 APT";
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
          title: "Cannot Save Wager",
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
        market_type: selectedMarketType,
        selected_matches: selectedMatches.map((match) => match.matchId), // Add selected matches
      });
      if (stakeError) {
        toast({
          title: "Error",
          description: `Error recording Wager to DB`,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["stake-bet"],
      });
      settxHash(executedTransaction.hash);
      setisLoading(false);
      setIsConfirmDialogOpen(false);
      setIsBettingFormOpen(false);
      setIsSuccessDialogOpen(true);
      setAmount("");
      setTotalGames("");
      setSelectedMatches([]),
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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .in("ccode", ["Champions League", "Europa League", "England", "Italy", "Spain", "France", "Germany"])
          .eq("finished", false)
          .eq("started", false)
          .eq("cancelled", false);

        if (error) throw error;
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setisFetching(false);
      }
    };

    fetchMatches();
  }, []);

  const toggleMatchSelection = (match) => {
    if (selectedMatches.find((m) => m.matchId === match.matchId)) {
      setSelectedMatches((prev) => prev.filter((m) => m.matchId !== match.matchId));
    } else {
      if (selectedMatches.length < 10) {
        setSelectedMatches((prev) => [...prev, match]);
      }
    }
  };

  const filterMatches = (league) => {
    setActiveFilter(league);
  };

  const leagues = [
    { id: "all", name: "All" },
    { id: "Europa League", name: "Europa League" },
    { id: "Champions League", name: "Champions League" },
    { id: "England", name: "England" },
    { id: "Italy", name: "Italy" },
    { id: "Spain", name: "Spain" },
    { id: "France", name: "France" },
    { id: "Germany", name: "Germany" },
  ];

  const formatMatchTime = (timeString) => {
    if (!timeString || timeString.length !== 14) {
      throw new Error("Invalid timestamp format. Expected YYYYMMDDHHMMSS");
    }

    // Parse the input time
    let hours = parseInt(timeString.substring(8, 10));
    const minutes = timeString.substring(10, 12);
    const month = parseInt(timeString.substring(4, 6));
    const day = parseInt(timeString.substring(6, 8));

    if (hours > 23 || parseInt(minutes) > 59) {
      throw new Error("Invalid hours or minutes");
    }

    // Apply UTC+1 offset
    hours = (hours + 1) % 24;

    // Handle DST for Central European Time
    // DST starts last Sunday in March and ends last Sunday in October
    const year = parseInt(timeString.substring(0, 4));
    const date = new Date(year, month - 1, day);

    // Get last Sunday in March
    const marchLastDay = new Date(year, 2, 31);
    const marchLastSunday = new Date(year, 2, 31 - marchLastDay.getDay());

    // Get last Sunday in October
    const octoberLastDay = new Date(year, 9, 31);
    const octoberLastSunday = new Date(year, 9, 31 - octoberLastDay.getDay());

    const isDST = date >= marchLastSunday && date < octoberLastSunday;

    // If in DST, adjust one more hour
    if (isDST) {
      hours = (hours + 1) % 24;
    }

    // Format with leading zeros
    const formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${minutes} (UTC+${isDST ? "02:00" : "01:00"})`;
  };

  const placeBetEvent = () => {
    console.log(selectedMatches);
    setTotalGames(selectedMatches.length.toString());
    setIsBettingFormOpen(true);
  };

  return (
    <div className="">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        {/* Balance Display */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {leagues.map((league) => (
              <Button
                key={league.id}
                onClick={() => filterMatches(league.id)}
                variant={activeFilter === league.id ? "default" : "outline"}
                className={`px-4 py-2 rounded-full ${
                  activeFilter === league.id ? "bg-amber-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {league.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Matches Counter */}
        {selectedMatches.length > 0 && (
          <div className="fixed bottom-4 left-0 right-0 mx-4 z-50">
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
              <span className="font-semibold">
                {selectedMatches.length} {selectedMatches.length === 1 ? "Match" : "Matches"} Selected
              </span>
              <Button onClick={() => placeBetEvent()} className="bg-white text-amber-500 hover:bg-gray-100">
                Wager
              </Button>
            </div>
          </div>
        )}

        {isFetching && (
          <div className="flex justify-center items-center py-16">
            <CustomLoader />
          </div>
        )}

        {/* Matches Grid */}
        {!isFetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {matches
              .filter((match) => activeFilter === "all" || match.ccode === activeFilter)
              .map((match) => (
                <Card
                  key={match.matchId}
                  className={`bg-gray-800 border-gray-700 cursor-pointer transform transition-all duration-200 hover:scale-102 ${
                    selectedMatches.find((m) => m.matchId === match.matchId) ? "ring-2 ring-amber-500" : ""
                  }`}
                  onClick={() => toggleMatchSelection(match)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      {/* <Badge variant="outline" className="text-gray-400">
                      {match.league}
                    </Badge> */}

                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatMatchTime(match.matchTime)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center space-x-4">
                      <div className="flex-1 text-center">
                        {/* <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 mx-auto mb-2" /> */}
                        <div className="text-white font-medium">{match.homeTeam}</div>
                      </div>

                      <div className="text-amber-500 font-bold text-lg">VS</div>

                      <div className="flex-1 text-center">
                        {/* <img src={match.awayLogo} alt={match.awayTeam} className="w-12 h-12 mx-auto mb-2" /> */}
                        <div className="text-white font-medium">{match.awayTeam}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
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
                  <span className="text-gray-400">Wager Amount:</span>
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
              className="w-full sm:w-1/2 mt-0  px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
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
              <AlertDialogTitle className="text-center text-amber-500">Wager Placed!</AlertDialogTitle>
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

      {/* Betting Form Dialog */}
      <Dialog open={isBettingFormOpen} onOpenChange={setIsBettingFormOpen}>
        <DialogContent className="w-[95%] bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-amber-500">Place Your Wager</DialogTitle>
          </DialogHeader>

          {/* Add your existing betting form content here */}
          {/* ... */}
          <div>
            {connected ? (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm text-gray-500"> {formattedBalance} APT</span>
                  </div>
                  {!priceLoading && !priceError && (
                    <span className="text-sm text-gray-500">
                      (${aptosToUsd(parseFloat(formattedBalance))?.toFixed(2)})
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            {/* Amount Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">Wager Amount</label>
                <button
                  onClick={toggleCurrency}
                  className="text-sm text-amber-500 hover:text-amber-600 flex items-center"
                >
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

            {/* Market Type Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-400">Market Type</label>
              </div>

              {/* Market Type Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedMarketType(selectedMarketType === "outcome" ? null : "outcome")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMarketType === "outcome"
                      ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  Outcome
                </button>
                <button
                  onClick={() => setSelectedMarketType(selectedMarketType === "ou" ? null : "ou")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMarketType === "ou"
                      ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  Over/Under
                </button>
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
            {/* <button
              onClick={handleSubmit}
              disabled={!connected}
              className={`w-full  py-4
           font-bold  transition-colors 
           ${!connected ? "bg-gray-300 rounded-lg text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 group"}`}
            >
              Place
            </button> */}
          </div>

          <DialogFooter className="flex flex-row space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsBettingFormOpen(false)}
              className="w-full  bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              className={`w-full 
  font-bold  transition-colors 
  ${!connected ? "bg-gray-300 rounded-lg text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-pink-600 transition-all duration-300 "}`}
              onClick={handleSubmit}
              disabled={!connected}
            >
              Confirm Wager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
