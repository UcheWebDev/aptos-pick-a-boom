import { Link, useLocation } from "react-router-dom";

import { LayoutDashboard, Library, Settings, X } from "lucide-react";
import {
  Home,
  Target,
  HelpCircle,
  Trophy,
  Users,
  Download,
  HelpCircleIcon,
  FileText,
  Lock,
  Shield,
  User,
  Coins,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Spinner from "./Spinner";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosBalance } from "@/hooks/useAptosBalance";

interface LeftSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const IsConnected = ({ act, balance, loadingBalance }) => {
  if (act) {
    return (
      <div className="p-6 bg-blue-700 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{balance} APT</h2>
            <button className="text-blue-200 hover:text-white flex items-center space-x-1">
              <span>
                {act?.address?.slice(0, 6)}....{act?.address?.slice(-4)}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingBalance) {
    return <Spinner />;
  }
};

const IsNotConnected = () => (
  <div className="p-6 bg-blue-800">
    <p className="text-sm text-gray-600 mb-6 text-white">Connect wallet to continue</p>
  </div>
);

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Target, label: "Stake", path: "/stakings" },
  { icon: Coins, label: "Pick A Boom", path: "/super-picks" },
  { icon: HelpCircle, label: "How to Play", path: "/how-to-play" },
  { icon: Trophy, label: "Leaderboard" },
  { icon: Users, label: "Refer A Friend" },
  { icon: HelpCircleIcon, label: "FAQs" },
  { icon: FileText, label: "Terms & Conditions" },
  { icon: Lock, label: "Privacy Policy" },
  { icon: Shield, label: "Responsible Gambling" },
];

export function LeftSidebar({ open, setOpen, act, balance, loadingBalance }) {
  const { connected, account } = useWallet();
  const { formattedBalance, isLoading, isError } = useAptosBalance(account);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-[240px] flex-col bg-slate-80 fixed top-0 left-0 h-full z-40">
        {connected ?? <IsConnected act={account} balance={formattedBalance} loadingBalance={isLoading} />}
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[240px] sm:w-[240px] bg-slate-800 text-white border-0">
          {connected ?? <IsConnected act={account} balance={formattedBalance} loadingBalance={isLoading} />}
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarContent() {
  return (
    <nav className="flex-1 space-y-2 p-4 bg-slate-800 ">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`flex items-center px-2 py-3 rounded-md transition-colors ${
            location.pathname === item.path ? "text-white font-semibold" : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          <item.icon className="h-5 w-5 mr-3" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
