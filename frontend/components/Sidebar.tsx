import React from "react";
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
import { Link } from "react-router-dom";

import Spinner from "./Spinner";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAptosBalance } from "@/hooks/useAptosBalance";

interface SidebarProp {
  isOpen: boolean;
  onClose: () => void;
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
  <div className="p-6 bg-blue-700">
    <h2 className="text-xl font-bold mb-4 text-white">Welcome to PickABoom</h2>
    <p className="text-sm text-gray-600 mb-6 text-white">Connect wallet to continue</p>

    <div className="grid grid-cols-2 gap-2 mb-6">
      <button className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Stake</button>
      <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm">Pick</button>
      {/* <button className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md text-sm col-span-2">PREDICTOR</button> */}
    </div>
  </div>
);

const isLoadingBalance = () => <Spinner />;

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

export default function Sidebar({ isOpen, onClose }: SidebarProp) {
  const { connected, account } = useWallet();
  const { formattedBalance, isLoading, isError } = useAptosBalance(account);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="">
          {/* connected User Profile Section */}
          {connected ? (
            <IsConnected act={account} balance={formattedBalance} loadingBalance={isLoading} />
          ) : (
            <IsNotConnected />
          )}
          <nav className="space-y-1 p-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center px-2 py-3 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={onClose}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
