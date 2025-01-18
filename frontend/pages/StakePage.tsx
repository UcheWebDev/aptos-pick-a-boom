import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Check, Copy, Plus, Minus, ChevronUp, Smile } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WalletSelector } from "../components/WalletSelector";
import { useAptosBalance } from "@/hooks/useAptosBalance";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Types
interface StakeState {
  amount: string;
  quantity: string;
  multiplier: number;
  selectedCut: number | null;
  selectedAmount: string | null;
}

interface BetResult {
  stake: number;
  potentialWin: number;
  bookingCode: string;
}

interface SectionState {
  amount: boolean;
  quantity: boolean;
  multiplier: boolean;
  flexCut: boolean;
  summary: boolean;
}

// Constants
const MULTIPLIER_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const PRESET_AMOUNTS = [10, 20, 30, 40, 50, 60] as const;
const CUT_OPTIONS = [1, 2, 3] as const;
const MIN_STAKE_APT = 0.01;

const WalletNotConnected = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
    <div className="rounded-full bg-gray-100 p-8 mb-6">
      <Smile className="w-5 h-5 text-gray-500" />
    </div>
    <h2 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">You Are Not Connected!</h2>
    <p className="text-xs md:text-sm text-gray-500 text-center max-w-sm mb-3">Please connect your wallet to continue</p>
  </div>
);

const StakePage = () => {
  const { connected, account } = useWallet();
  const { formattedBalance, isLoading, isError } = useAptosBalance(account);
  // State
  const [stakeState, setStakeState] = useState<StakeState>({
    amount: "",
    quantity: "1",
    multiplier: 1,
    selectedCut: null,
    selectedAmount: null,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState<SectionState>({
    amount: true, // Keep amount section open by default
    quantity: false,
    multiplier: false,
    flexCut: false,
    summary: false,
  });

  // Mock data (should come from API/props in real application)
  const betResult: BetResult = {
    stake: 2000,
    potentialWin: 126773.85,
    bookingCode: "FD776691",
  };

  // Handlers
  const updateStakeState = (updates: Partial<StakeState>) => {
    setStakeState((prev) => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: keyof SectionState) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Rest of the handlers remain the same...
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      updateStakeState({ quantity: value });
    }
  };

  const handleQuantityAdjust = (increment: boolean) => {
    const currentValue = parseInt(stakeState.quantity);
    if (!isNaN(currentValue)) {
      const newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
      updateStakeState({ quantity: newValue.toString() });
    }
  };

  const handleCut = (cutNumber: number) => {
    if (cutNumber === stakeState.selectedCut) {
      updateStakeState({ selectedCut: null });
    } else {
      const newAmount = stakeState.amount ? (parseFloat(stakeState.amount) / cutNumber).toFixed(2) : "";
      updateStakeState({
        selectedCut: cutNumber,
        amount: newAmount,
      });
    }
  };

  const handleAmountPick = (amount: string) => {
    updateStakeState({
      selectedAmount: amount === stakeState.selectedAmount ? null : amount,
      amount: amount === stakeState.selectedAmount ? "" : amount,
    });
  };

  // Collapsible Section Component
  const CollapsibleSection = ({
    title,
    isOpen,
    onToggle,
    children,
    showDivider = true,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    showDivider?: boolean;
  }) => (
    <div className={`${showDivider ? "border-b border-gray-100 " : ""} py-4`}>
      <button onClick={onToggle} className="w-full flex justify-between items-center py-2 text-left">
        <span className="text-gray-900 text-xs md:text-sm font-medium">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );

  // Header Component
  const Header = () => (
    <div className="flex justify-center fixed top-0 left-0 right-0 ">
      <header className="px-8 bg-blue-900 py-4 flex items-center justify-between max-w-4xl w-full ">
        <Link to="/" className="p-2 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        {/* <h1 className="text-white">Stake</h1> */}
        <div className="relative">
          <WalletSelector />
        </div>
      </header>
    </div>
  );

  // const Header = () => (
  //   <div className="flex justify-center fixed top-0 left-0 right-0 bg-blue-900 z-10">
  //     <header className="bg-blue-900 px-4 py-4 flex items-center justify-between max-w-4xl w-full">
  //       <div className="flex justify-between items-center gap-4">
  //         <Link to="/" className="p-2 transition-colors">
  //           <ArrowLeft className="w-6 h-6 text-white" />
  //         </Link>
  //         <h1 className="text-xs md:text-sm text-white">Stake</h1>
  //       </div>
  //       <WalletSelector />
  //     </header>
  //   </div>
  // );

  // Success Dialog Component
  const SuccessDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-white p-6 max-w-sm mx-auto rounded-xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-green-500 rounded-full p-2">
            <Check className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-xs md:text-sm text-gray-900">Bet Successful</h2>

          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-800 text-xs md:text-sm">Total Stake</span>
              <span className="text-gray-900 text-xs md:text-sm">{betResult.stake.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 text-xs md:text-sm">Potential Win</span>
              <span className="text-gray-900 text-xs md:text-sm">{betResult.potentialWin.toLocaleString()}</span>
            </div>

            <div className="bg-gray-50 rounded-2xl shadow-sm border p-6">
              <div>
                <span className="text-gray-600 text-xs md:text-sm">Stake Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-900 text-xs md:text-sm">{betResult.bookingCode}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <button className="py-4 px-6 rounded-xl text-xs md:text-sm bg-blue-900 text-white hover:bg-blue-900 active:bg-blue-800 transition-colors duration-200">
              Rebet
            </button>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="py-4 px-6 rounded-xl text-xs md:text-sm bg-gray-300 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading balance</div>;
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto p-6 pt-28">
          <WalletNotConnected />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900">
      <Header />

      <div className="max-w-2xl mx-auto p-6 pt-24">
        <div className="bg-white rounded-lg p-4">
          {/* Stake Amount Section */}
          <CollapsibleSection
            title="Stake Amount"
            isOpen={sectionsOpen.amount}
            onToggle={() => toggleSection("amount")}
          >
            <div className="space-y-4">
              <input
                type="number"
                value={stakeState.amount}
                onChange={(e) => updateStakeState({ amount: e.target.value })}
                className="w-full bg-gray-100 rounded-xl py-3 p-4 outline-none text-gray-900 text-xs md:text-sm"
                placeholder="Enter Staking Amount"
              />

              <div className="flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountPick(preset.toString())}
                    className={`flex-1 py-3 px-4 rounded-full text-xs md:text-sm transition-colors duration-200 
                      ${
                        stakeState.selectedAmount === preset.toString()
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 transparent text-gray-900 "
                      }`}
                  >
                    +{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Quantity Section */}
          <CollapsibleSection
            title="Total Picks"
            isOpen={sectionsOpen.quantity}
            onToggle={() => toggleSection("quantity")}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityAdjust(false)}
                className="p-3 rounded-xl bg-gray-200 text-dark hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                value={stakeState.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="flex-1 bg-gray-100 rounded-xl py-3 p-4 outline-none text-gray-900 text-xs md:text-sm text-center"
                min="1"
              />
              <button
                onClick={() => handleQuantityAdjust(true)}
                className="p-3 rounded-xl bg-gray-200 shadow text-dark hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </CollapsibleSection>

          {/* Multiplier Section */}
          <CollapsibleSection
            title="Profit Multiplier"
            isOpen={sectionsOpen.multiplier}
            onToggle={() => toggleSection("multiplier")}
          >
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={stakeState.multiplier}
                onChange={(e) => updateStakeState({ multiplier: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-blue-900"
              />
              <div className="flex justify-between px-2">
                {MULTIPLIER_VALUES.map((value) => (
                  <div key={value} className="text-xs text-gray-600 flex flex-col items-center">
                    <div className="h-1 w-0.5 bg-gray-300 mb-1"></div>
                    {value}x
                  </div>
                ))}
              </div>
              <div className="text-right">
                <span className="min-w-[4rem] text-gray-900 font-medium text-xs md:text-sm">
                  {stakeState.multiplier}x
                </span>
              </div>
            </div>
          </CollapsibleSection>

          {/* Flex Cut Section */}
          <CollapsibleSection title="Flex Cut" isOpen={sectionsOpen.flexCut} onToggle={() => toggleSection("flexCut")}>
            <div className="flex gap-4 flex-wrap">
              {CUT_OPTIONS.map((cutNumber) => (
                <button
                  key={cutNumber}
                  onClick={() => handleCut(cutNumber)}
                  className={`py-3 px-4 rounded-full text-xs md:text-sm transition-colors duration-200
                    ${
                      stakeState.selectedCut === cutNumber
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-200"
                    }`}
                >
                  cut {cutNumber}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Summary Section */}
          <CollapsibleSection
            title="Stake Summary"
            isOpen={sectionsOpen.summary}
            onToggle={() => toggleSection("summary")}
            showDivider={false}
          >
            <div className="items-center space-y-4 p-6 bg-gray-100 rounded-2xl">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="text-gray-900 text-xs md:text-sm">Min Stake</span>
                <span className="text-gray-900 text-xs md:text-sm">(APT {MIN_STAKE_APT})</span>
              </div>
              <div className="border-t flex justify-between">
                <div className="text-gray-600 text-xs md:text-sm mt-4">POT WIN.</div>
                <h3 className="text-gray-900 text-xs md:text-sm mt-4">2000 APT</h3>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Proceed Button */}
        <div className="mt-6">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="w-full py-6 px-4 rounded-full font-bold uppercase text-xs md:text-sm bg-gray-800/50 text-gray-100 transition-colors duration-200"
          >
            Proceed
          </button>
        </div>
      </div>

      <SuccessDialog />
    </div>
  );
};

export default StakePage;
