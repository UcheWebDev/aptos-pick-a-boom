import { Bell, Menu, Search, Settings, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletSelector } from "@/components/WalletSelector";

interface TopNavProps {
  onMenuClick: () => void;
  className?: string;
}

export function TopNav({ onMenuClick, className = "" }: TopNavProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b bg-[#001041] ${className}`}>
      <div className="w-full max-w-screen-xl mx-auto flex h-14 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={onMenuClick}>
          <Menu className="h-5 w-5 text-white" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white hidden md:block">PickABoom</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <WalletSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
