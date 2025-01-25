import React from "react";
import { AlignLeft,Gem } from "lucide-react";

interface MobileNavProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onToggleSidebar }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900  z-30 px-4">
      <div className="flex items-center justify-between h-full">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
        <div className="bg-gray-900 p-2 rounded-lg">
              <Gem className="w-6 h-6 text-amber-500" />
            </div>
          <span className="text-xl font-semibold text-white">PickABoom</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
