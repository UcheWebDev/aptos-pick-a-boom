import React from "react";
import { AlignLeft } from "lucide-react";

interface MobileNavProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onToggleSidebar }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4">
      <div className="flex items-center justify-between h-full">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
          <AlignLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-semibold text-dark">PickABoom</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
