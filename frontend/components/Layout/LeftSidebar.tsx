import React from "react";
import { X, Gem } from "lucide-react";
import { menuItems } from "../../data/menuItems";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import SidebarProfile from "../U/SidebarProfile";
import NavItem from "../U/NavItem";

interface LeftSidebarProps {
  onClose: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-full flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-8 ">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 p-2 rounded-lg">
              <Gem className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-xl font-semibold text-white">PickABoom</span>
          </div>
          {!isDesktop && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        <nav className="space-y-8">
          {menuItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
