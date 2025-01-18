import { Link } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ArrowUpRight, ArrowDownRight, Smile, Grid } from "lucide-react";
import { WalletSelector } from "@/components/WalletSelector";
import { useAptosBalance } from "@/hooks/useAptosBalance";
import BetHistoryList from "@/components/BetHistoryList";
import HomeHeader from "../components/HomeHeader";

const betHistory = [
  {
    id: 1,
    type: "Stake",
    count: "1/1",
    stake: 5000.0,
    odds: 3.5,
    potentialWin: 17500.0,
    status: "won",
    wonAmount: 17500.0,
  },
  {
    id: 2,
    type: "Stake",
    count: "2/3",
    stake: 1000.0,
    odds: 2.5,
    potentialWin: 2500.0,
    status: "lost",
  },
];

const Header = () => (
  <div className="flex justify-center fixed top-0 left-0 right-0 ">
    <header className="px-8 bg-blue-900 py-6 flex items-center justify-between max-w-4xl w-full ">
      <Grid className="w-8 h-8 text-white" />

      <div className="relative">
        <WalletSelector />
      </div>
    </header>
  </div>
);

const ActionButtons = () => (
  <div className="grid grid-cols-2 gap-4">
    <Link
      to="/stake"
      className="text-sm flex items-center justify-center gap-2 bg-gray-200 text-gray-500  py-4 px-4 rounded-full "
    >
      <ArrowUpRight className="w-5 h-5" />
      STAKE
    </Link>
    <Link
      to="/play"
      className="text-sm flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-3 px-4 rounded-full transition-colors"
    >
      <ArrowDownRight className="w-5 h-5" />
      PICK
    </Link>
  </div>
);

const WalletNotConnected = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
    <div className="rounded-full bg-gray-100 p-8 mb-6">
      <Smile className="w-5 h-5 text-gray-500" />
    </div>
    <h2 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">You Are Not Connected!</h2>
    <p className="text-xs md:text-sm text-gray-500 text-center max-w-sm mb-3">Please connect your wallet to continue</p>
  </div>
);

const Wallet = () => {
  const { connected, account } = useWallet();
  const { formattedBalance, isLoading, isError } = useAptosBalance(account);

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
    <div className="min-h-screen bg-blue-900 ">
      <Header />
      <div className="max-w-2xl mx-auto pt-24 p-6">
        <div className="bg-gray-50 mb-3 space-y-6 rounded-lg">
          {/* Balance */}
          <div className="mb-6 text-center pb-6 p-6 bg-white rounded-lg">
            <div className="mb-6 p-4">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-dark">{formattedBalance}</span>
                <span className="text-2xl text-gray-400">APT</span>
              </div>
              <div className="text-sm text-gray-900">
                {account?.address?.slice(0, 6)}....{account?.address?.slice(-4)}
              </div>
            </div>

            <ActionButtons />
          </div>
          {/* History Section */}
          <div className="pt-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xs md:text-sm text-gray-500">RECENT BETS</h2>
              </div>
            </div>

            <BetHistoryList bets={betHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
