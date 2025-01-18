import React, { useState, useEffect } from "react";
import { Clock, Check } from "lucide-react";

const FixturesSelection = ({ matches, maxAllowedSelections = 10, alreadySelectedMatches, onSelectionChange }) => {
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All"); // 'All' for no filter

  const handleMatchSelect = (match) => {
    let newSelection = [...selectedMatches];
    const matchIndex = newSelection.findIndex((m) => m.id === match.id);

    if (matchIndex > -1) {
      // Remove match if already selected
      newSelection.splice(matchIndex, 1);
    } else if (newSelection.length < maxAllowedSelections) {
      // Add match if under max allowed selections
      newSelection.push(match);
    } else {
      // Optional: Show toast notification that max selections reached
      return;
    }

    setSelectedMatches(newSelection);
    onSelectionChange(newSelection); // Notify parent of change with new selection
  };

  const formatMatchTime = (timeStr) => {
    try {
      const [day, month, year, hours, minutes] = timeStr.split(/[.: ]/);
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeStr;
    }
  };

  const filteredMatches = activeFilter === "All" ? matches : matches.filter((match) => match.ccode === activeFilter);

  const uniqueLeagues = ["All", ...new Set(matches.map((match) => match.ccode))];

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Matches</h3>
          <span className="text-sm text-gray-600">Selected: {selectedMatches.length}</span>
        </div>

        <div className="flex overflow-x-auto gap-2 mt-4">
          {uniqueLeagues.map((league) => (
            <button
              key={league}
              onClick={() => setActiveFilter(league)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                activeFilter === league
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {league}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-2 px-4">
        {filteredMatches.map((match) => {
          const isSelected = selectedMatches.some((m) => m.id === match.id);

          return (
            <div
              key={match.id}
              onClick={() => handleMatchSelect(match)}
              className={`
                relative p-4 rounded-lg border transition-all cursor-pointer
                ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
              )}

              <div className="text-xs font-medium text-center text-gray-500 mb-2">{match.ccode} League</div>

              <div className="grid grid-cols-3 items-center gap-2">
                <div className="text-right">
                  <p className="font-medium truncate">{match.homeTeam}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">vs</span>
                  {/* <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    
                    {formatMatchTime(match.matchTime)}
                  </div> */}
                </div>
                <div className="text-left">
                  <p className="font-medium truncate">{match.awayTeam}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <p className="text-lg font-medium">No matches available</p>
            <p className="text-sm mt-2">Check back later for upcoming fixtures</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixturesSelection;
