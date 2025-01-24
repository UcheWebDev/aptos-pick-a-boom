import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, Menu, Database, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import SearchBar from "../U/SearchBar";
import UserProfile from "../U/UserProfile";
import { WalletSelector } from "@/components/WalletSelector";

// Custom hook to track scroll position
const useScrollPosition = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY >= 5;
      setScrolled(isScrolled);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
};

interface TopNavProps {
  onMenuClick: () => void;
  onNotificationsClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick, onNotificationsClick }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolled = useScrollPosition();

  // Function to get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;

    // Remove leading slash and capitalize first letter
    if (path === "/") return "";

    const title = path
      .substring(1) // Remove leading slash
      .split("-") // Split by hyphens if present
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join with spaces

    return title || ""; // Fallback to Dashboard if path is empty
  };

  // Check if current page is homepage
  const isHomePage = location.pathname === "/";

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <nav
      className={`bg-gray-900 px-4 md:px-6 py-3 border-b border-gray-800 ${!isDesktop ? "mt-16" : ""} flex-none transition-shadow duration-200 ${isScrolled ? "border border-b shadow-2xl" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isDesktop && (
            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <button onClick={handleBackClick} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-md font-semibold text-gray-400">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* {isHomePage && (
            <button
              className="px-4 py-3 rounded-lg text-xs font-medium transition-colors mt-2
                bg-white border border-gray-800 hover:bg-white hover:text-gray-800
                text-gray-800 block sm:hidden"
              onClick={onNotificationsClick}
            >
              Load
            </button>
          )} */}

          <WalletSelector />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
