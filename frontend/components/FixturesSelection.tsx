import React, { useState } from "react";
import { BookText, Check, Calendar } from "lucide-react";
import Flag from "../components/Flag";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const FixturesSelection = ({
  matches,
  maxAllowedSelections = 10,
  alreadySelectedMatches = [],
  onSelectionChange,
  currentSelection = [],
}) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const parseMatchDate = (dateStr) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return new Date(year, month - 1, day);
  };

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

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const formatMatchTime = (timeStr) => {
    try {
      const [day, month, year, hours, minutes] = timeStr.split(/[.: ]/);
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeStr;
    }
  };

  const getDayLabel = (dateStr) => {
    const matchDate = parseMatchDate(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedMatchDate = normalizeDate(matchDate);
    const normalizedToday = normalizeDate(today);
    const normalizedTomorrow = normalizeDate(tomorrow);
    const normalizedDayAfter = normalizeDate(dayAfterTomorrow);

    if (normalizedMatchDate.getTime() === normalizedToday.getTime()) return "Today";
    if (normalizedMatchDate.getTime() === normalizedTomorrow.getTime()) return "Tomorrow";
    return format(matchDate, "EEE");
  };

  const filteredMatches = matches.filter((match) => {
    const matchDate = parseMatchDate(match.matchTime);
    const isSameDate =
      matchDate.getDate() === selectedDate.getDate() &&
      matchDate.getMonth() === selectedDate.getMonth() &&
      matchDate.getFullYear() === selectedDate.getFullYear();
    return (activeFilter === "All" || match.ccode === activeFilter) && isSameDate;
  });

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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCalendarOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">{format(selectedDate, "dd MMM yyyy")}</span>
              </button>
              <div className="relative">
                <BookText className="h-5 w-5 text-gray-400" />
                {currentSelection.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1">
                    {currentSelection.length}
                  </span>
                )}
              </div>
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

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-medium text-gray-400">{match.ccode} League</span>
                  <span className="text-xs font-medium text-gray-400">{getDayLabel(match.matchTime)}</span>
                </div>

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

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="w-[95%] bg-gray-900 border-gray-800 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Select Date</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center flex justify-center">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md text-white [&_.rdp-day]:text-white [&_.rdp-day_button:hover]:bg-gray-700 [&_.rdp-day_button:focus]:bg-gray-700 [&_.rdp-button]:text-dark [&_.rdp-nav_button:hover]:bg-gray-700 [&_.rdp-caption]:text-white"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FixturesSelection;
