import React from "react";
import { Crown } from "lucide-react";

import { WalletSelector } from "@/components/WalletSelector";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <Crown className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">PickABoom</span>
            </div>
          </div>

          <div className="">
            <div className="flex items-center space-x-4">
              <WalletSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
