import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WalletSelector } from "../components/WalletSelector";

import {
  ChevronLeft,
  ChevronRight,
  Home,
  Minus,
  BellRing,
  X,
  ArrowLeft,
  Check,
  Trophy,
  Handshake,
  Settings,
  Trash2,
  Clock,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Flag from "./Flag";

const BettingOdds = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOdds, setSelectedOdds] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 3;

  const matches = [
    {
      time: "17'",
      league: "Spain - A-League",
      teams: [
        { name: "Melbourne Victory", score: 0 },
        { name: "Macarthur FC", score: 0 },
      ],
      odds: [1.75, 3.5, 4.75],
      isWomen: false,
    },
    {
      time: "59'",
      league: "Italy - A-League, Women",
      teams: [
        { name: "Melbourne City FC (W)", score: 1 },
        { name: "Perth Glory FC (W)", score: 2 },
      ],
      odds: [3.25, 2.8, 2.4],
      isWomen: true,
    },
    {
      time: "16'",
      league: "Australia - A-League, Women",
      teams: [
        { name: "Newcastle Jets (W)", score: 0 },
        { name: "Western Sydney Wanderers (W)", score: 1 },
      ],
      odds: [4.5, 4.0, 1.7],
      isWomen: true,
    },
    {
      time: "14'",
      league: "Japan - J.League",
      teams: [
        { name: "FC Tokyo", score: 0 },
        { name: "Shonan Bellmare", score: 0 },
      ],
      odds: [2.75, 3.25, 2.63],
      isWomen: false,
    },
    {
      time: "56'",
      league: "England - J.League",
      teams: [
        { name: "Sanfrecce Hiroshima", score: 0 },
        { name: "Kyoto Sanga FC", score: 0 },
      ],
      odds: [2.0, 2.63, 5.5],
      isWomen: false,
    },
  ];

  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const getCurrentPageMatches = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return matches.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPredictionLabel = (oddIndex) => {
    switch (oddIndex) {
      case 0:
        return "Home";
      case 1:
        return "Draw";
      case 2:
        return "Away";
      default:
        return "";
    }
  };

  const handleOddSelect = (matchIndex, oddIndex, value, teams) => {
    const globalMatchIndex = (currentPage - 1) * itemsPerPage + matchIndex;
    const existingSelectionIndex = selectedOdds.findIndex((odd) => odd.matchIndex === globalMatchIndex);

    if (existingSelectionIndex !== -1) {
      if (selectedOdds[existingSelectionIndex].oddIndex === oddIndex) {
        setSelectedOdds(selectedOdds.filter((_, index) => index !== existingSelectionIndex));
        return;
      }
      const newSelections = [...selectedOdds];
      newSelections[existingSelectionIndex] = {
        matchIndex: globalMatchIndex,
        oddIndex,
        value,
        teamNames: teams.map((t) => t.name),
        prediction: getPredictionLabel(oddIndex),
      };
      setSelectedOdds(newSelections);
    } else {
      setSelectedOdds([
        ...selectedOdds,
        {
          matchIndex: globalMatchIndex,
          oddIndex,
          value,
          teamNames: teams.map((t) => t.name),
          prediction: getPredictionLabel(oddIndex),
        },
      ]);
    }
  };

  const handleRemoveSelection = (indexToRemove) => {
    setSelectedOdds(selectedOdds.filter((_, index) => index !== indexToRemove));
  };

  const getCountryFromLeague = (league) => {
    const country = league.split("-")[0].trim().toLowerCase();
    return country.charAt(0).toUpperCase() + country.slice(1);
  };

  const renderOddIcon = (oddIndex) => {
    switch (oddIndex) {
      case 0:
        return <Check className="w-3 h-3 " />;
      case 1:
        return <X className="w-3 h-3" />;
      case 2:
        return <Check className="w-4 h-3 " />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="flex justify-center fixed top-0 left-0 right-0 z-10">
        <header className="bg-blue-900 px-4 py-4 flex items-center justify-between max-w-4xl w-full mx-2 my-2">
          <div className="flex justify-between items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-xs md:text-sm font-semibold text-white">Pick Games</h1>
          </div>
          <div className="relative">
            <WalletSelector />
          </div>
        </header>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setIsDialogOpen(true)} className="relative inline-block">
          <BellRing className="w-10 h-10 text-white" />
          {selectedOdds.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {selectedOdds.length}
            </div>
          )}
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-2">
          <DialogHeader>
            <DialogTitle>Selected Bets ({selectedOdds.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedOdds.map((selection, index) => (
              <div>
                {/* Bet Details */}
                <div key={index} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">
                      {" "}
                      {selection.teamNames[0]} vs {selection.teamNames[1]}
                    </span>
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold text-xs">{selection.prediction}</span>
                      <button className="ml-2 text-gray-500" onClick={() => handleRemoveSelection(index)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4">
              <button className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-bold text-xs md:text-sm  transition-colors">
                PLACE BET
              </button>
            </div>
            {selectedOdds.length === 0 && <p className="text-center text-gray-500 py-4">No bets selected</p>}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-2xl mx-auto p-4 pt-24">
        <div className="bg-blue-900 p-4 md:p-6 space-y-8">
          <div className="flex justify-end mb-2 pr-4">
            <div className="flex gap-4 md:gap-1">
              <div className="w-10 md:w-16 text-center text-white text-sm flex flex-col items-center">
                {/* <Home className="w-4 h-4" /> */}
                <span className="text-xs mt-1 font-bold">1</span>
              </div>
              <div className="w-10 md:w-16 text-center text-white text-sm flex flex-col items-center">
                {/* <Minus className="w-4 h-4" /> */}
                <span className="text-xs mt-1 font-bold">x</span>
              </div>
              <div className="w-10 md:w-16 text-center text-white text-sm flex flex-col items-center">
                {/* <ExternalLink className="w-4 h-4" /> */}
                <span className="text-xs mt-1 font-bold">2</span>
              </div>
            </div>
          </div>

          {getCurrentPageMatches().map((match, matchIndex) => (
            <div
              key={matchIndex}
              className="mb-4 bg-gray-100 rounded-lg p-2 md:p-4 cursor-pointer transition-colors shadow-sm"
            >
              <div className="p-2 md:p-3 border-b">
                <div className="flex items-center gap-2">
                  <Flag country={getCountryFromLeague(match.league)} size="sm" className="rounded-sm" />
                  <span className="text-gray-800 text-xs md:text-sm truncate">{match.league}</span>
                </div>
              </div>

              <div className="p-2 md:p-3 flex flex-col md:flex-row md:items-center">
                <div className="flex-1 mb-3 md:mb-0">
                  {match.teams.map((team, idx) => (
                    <div key={idx} className="flex justify-between mb-1 items-center">
                      <span className="text-xs md:text-sm font-medium text-gray-800 truncate">{team.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 md:gap-4 justify-end md:ml-4">
                  {[0, 1, 2].map((oddIndex) => {
                    const globalMatchIndex = (currentPage - 1) * itemsPerPage + matchIndex;
                    const isSelected = selectedOdds.some(
                      (selection) => selection.matchIndex === globalMatchIndex && selection.oddIndex === oddIndex,
                    );

                    return (
                      <button
                        key={oddIndex}
                        onClick={() => handleOddSelect(matchIndex, oddIndex, match.odds[oddIndex], match.teams)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors 
                          ${isSelected ? "bg-blue-900 text-white" : "bg-white text-blue-900 hover:bg-blue-100"}`}
                      >
                        {renderOddIcon(oddIndex)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center items-center gap-2 p-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-100  rounded-md disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors
                    ${currentPage === page ? "bg-blue-900 text-white" : "text-black hover:bg-gray-100"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-gray-100 rounded-md disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingOdds;
