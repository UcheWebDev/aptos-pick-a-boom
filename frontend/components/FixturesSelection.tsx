import React, { useState } from "react";
import { Clock, Check } from "lucide-react";

const FixturesSelection = ({
  matches,
  maxAllowedSelections = 10,
  alreadySelectedMatches = [],
  onSelectionChange,
  currentSelection = [],
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleMatchSelect = (match) => {
    let newSelection = [...currentSelection];
    const matchIndex = newSelection.findIndex((m) => m.id === match.id);

    if (matchIndex > -1) {
      newSelection.splice(matchIndex, 1);
    } else if (alreadySelectedMatches.some((m) => m.id === match.id)) {
      const updatedSelection = currentSelection.filter((m) => m.id !== match.id);
      onSelectionChange(updatedSelection, match.id);
      return;
    } else if (newSelection.length < maxAllowedSelections) {
      newSelection.push(match);
    } else {
      return;
    }

    onSelectionChange(newSelection);
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

  const TeamLogo = ({ src, teamName }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={`${teamName} logo`}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.src = "/api/placeholder/32/32";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
            {teamName.charAt(0)}
          </div>
        )}
      </div>
      <p className="font-medium text-sm text-center line-clamp-2">{teamName}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white p-4 border-b z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Matches</h3>
          <span className="text-sm text-gray-600">Selected: {currentSelection.length}</span>
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
          const isSelected = currentSelection.some((m) => m.id === match.id);
          const isAlreadySelected = alreadySelectedMatches.some((m) => m.id === match.id);

          return (
            <div
              key={match.id}
              onClick={() => handleMatchSelect(match)}
              className={`
                relative p-4 rounded-lg border transition-all cursor-pointer
                ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}
                ${isAlreadySelected ? "border-blue-500 bg-blue-50" : ""}
              `}
            >
              {(isSelected || isAlreadySelected) && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
              )}

              <div className="text-xs font-medium text-center text-gray-500 mb-4">{match.ccode} League</div>

              <div className="grid grid-cols-3 items-center gap-4">
                <TeamLogo src={match.homeLogo} teamName={match.homeTeam} />
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">vs</span>
                </div>
                <TeamLogo src={match.awayLogo} teamName={match.awayTeam} />
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
