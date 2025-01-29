import React from "react";
import { Newspaper } from "lucide-react";

const NoArticles = () => {
  return (
    <div className="relative w-full h-64">
      {/* Gradient background effect */}

      {/* Main content container */}
      <div className="relative h-full bg-gray-900/80 backdrop-blur-xl  rounded-lg p-6 flex flex-col items-center justify-center">
        {/* Decorative top border gradient */}

        <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-0.5 rounded-full mb-4">
          <div className="bg-gray-900 p-3 rounded-full">
            <Newspaper className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Text content */}
        <h3 className="text-lg font-bold text-white mb-2">No Articles Found</h3>
        <p className="text-gray-400 text-sm text-center">Check back later for the latest updates and news</p>

        {/* Animated pulse effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent"></div>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 blur-xl -z-10"></div>
    </div>
  );
};

export default NoArticles;
