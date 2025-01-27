import React, { useState } from "react";
import { BookText, Check } from "lucide-react";
import Flag from "../components/Flag";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
      <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
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
      <p className="font-medium text-sm text-gray-400 text-center line-clamp-2">{teamName}</p>
    </div>
  );

  return (
    <Card className="bg-gray-950 border-gray-800">
      <div className="space-y-4">
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-4 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-white">Select Matches</CardTitle>
            <div className="relative">
              <BookText className="h-5 w-5 text-gray-400" />
              {currentSelection.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full 
                          min-w-[18px] h-[18px] inline-flex items-center justify-center px-1"
                >
                  {currentSelection.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 mt-4">
            {uniqueLeagues.map((league) => (
              <button
                key={league}
                onClick={() => setActiveFilter(league)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeFilter === league ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {league !== "All" && <Flag ccode={league} size="sm" className="rounded-sm mr-2" />}
                <span className="whitespace-nowrap">{league}</span>
              </button>
            ))}
          </div>
        </div>

        <CardContent className="max-h-[60vh] overflow-y-auto space-y-2 p-4">
          {filteredMatches.map((match) => {
            const isSelected = currentSelection.some((m) => m.id === match.id);
            const isAlreadySelected = alreadySelectedMatches.some((m) => m.id === match.id);

            return (
              <div
                key={match.id}
                onClick={() => handleMatchSelect(match)}
                className={`
                  relative p-4 rounded-lg bg-gray-900 border transition-all cursor-pointer
                  ${
                    isSelected || isAlreadySelected
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-800 hover:border-blue-500/50 hover:bg-gray-800"
                  }
                `}
              >
                {(isSelected || isAlreadySelected) && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                )}

                <div className="text-xs font-medium text-center text-gray-400 mb-4">{match.ccode} League</div>

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
        </CardContent>
      </div>
    </Card>
  );
};

export default FixturesSelection;
