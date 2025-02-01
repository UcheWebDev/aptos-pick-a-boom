import React from "react";
import { Timer, Check, X } from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";

// Updated MatchCard component with better existing selection handling
const MatchCard = ({ match, marketType, existingSelection, currentSelections, onSelect, result }) => {
  const renderMatchState = () => {
    if (match.cancelled) {
      return <div className="text-red-500 text-sm font-medium">Match Cancelled</div>;
    }

    if (match.started && !match.finished) {
      return (
        <span className="flex items-center text-red-500 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
          LIVE
          {match.homeScore !== undefined && match.awayScore !== undefined && (
            <span className="ml-2 font-bold">
              {match.homeScore} - {match.awayScore}
            </span>
          )}
        </span>
      );
    }

    if (match.finished) {
      return (
        <div className="text-green-600 text-sm font-medium">
          Final Score: {match.homeScore} - {match.awayScore}
        </div>
      );
    }

    return (
      <div className="flex items-center text-gray-500 text-sm">
        <Timer className="h-4 w-4 mr-1" />
        {match.matchTime}
      </div>
    );
  };

  // Check if there's an existing selection for this match
  const hasExistingSelection = existingSelection?.prediction !== null;
  const isDisabled = match.started || match.finished || match.cancelled || hasExistingSelection;
  const currentSelection = currentSelections.find((s) => s.matchId === match.matchId);

  // Selection Button component with existing selection handling
  const SelectionButton = ({ prediction, label, alignment = "center" }) => {
    const isSelected = currentSelection?.prediction === prediction;
    const isExistingPrediction = existingSelection?.prediction === prediction;

    let buttonClass = "p-3 rounded-lg transition-colors ";
    if (isDisabled && !isExistingPrediction) {
      buttonClass += "opacity-50 cursor-not-allowed ";
    } else if (isSelected) {
      buttonClass += "bg-gray-900 ring-2 ring-amber-500 text-white ";
    } else if (isExistingPrediction) {
      buttonClass += "ring-2 ring-amber-500 text-white ";
    } else {
      buttonClass += "hover:bg-gray-700 text-white border border-gray-500 ";
    }

    return (
      <button
        onClick={() => !isDisabled && onSelect(match.matchId, prediction, match.homeTeam, match.awayTeam)}
        disabled={isDisabled}
        className={buttonClass}
      >
        <div className="flex items-center justify-between mb-2">
          {isExistingPrediction && (
            <div className="absolute top-2 right-2">
              {result === "correct" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : result === "incorrect" ? (
                <X className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          )}
        </div>
        <div className={`text-sm font-medium text-${alignment}`}>{label}</div>
        {isExistingPrediction && <div className="text-xs mt-1 text-gray-300">Your prediction</div>}
      </button>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CountryFlag countryName={match.ccode} size={16} className="rounded-sm" />
          <span className="text-sm font-medium text-gray-400">{match.league}</span>
        </div>
        {renderMatchState()}
      </div>

      <div className={`grid ${marketType === "outcome" ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
        {marketType === "outcome" ? (
          <>
            <SelectionButton prediction="home" label={match.homeTeam} alignment="left" />
            <SelectionButton prediction="draw" label="Draw" />
            <SelectionButton prediction="away" label={match.awayTeam} alignment="right" />
          </>
        ) : (
          <>
            <SelectionButton prediction="over" label="Over 2.5" />
            <SelectionButton prediction="under" label="Under 2.5" />
          </>
        )}
      </div>

      {hasExistingSelection && (
        <div className="mt-4 text-sm text-gray-400 text-center">You have already made a prediction for this match</div>
      )}
    </div>
  );
};

export default MatchCard;
