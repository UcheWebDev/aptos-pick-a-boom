import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Selection } from "../types/types";

type SelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selections: Selection[];
  marketType: string;
  isSaving: boolean;
  onSave: () => void;
};

const SelectionDialog: React.FC<SelectionDialogProps> = ({
  open,
  onOpenChange,
  selections,
  marketType,
  isSaving,
  onSave,
}) => {
  const getResultText = (selection: Selection) => {
    if (marketType === "outcome") {
      switch (selection.prediction) {
        case "home":
          return `${selection.homeTeam} Win`;
        case "draw":
          return "Draw";
        case "away":
          return `${selection.awayTeam} Win`;
        default:
          return "";
      }
    }
    return selection.prediction === "over" ? "Over 2.5" : "Under 2.5";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] sm:max-w-md rounded-lg bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle className="text-center text-amber-500">Your Predictions</DialogTitle>
          <DialogDescription>
            Review your {marketType === "outcome" ? "match outcome" : "goals"} predictions before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="divide-y divide-gray-800">
            {selections.map((selection, index) => (
              <div key={index} className="py-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-400">
                    {selection.homeTeam} vs {selection.awayTeam}
                  </span>
                </div>
                <div className="text-sm text-amber-500">{getResultText(selection)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4">
            <button
              onClick={onSave}
              disabled={isSaving || selections.length === 0}
              className={`w-full text-dark py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                isSaving || selections.length === 0 ? "w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600 cursor-not-allowed" : "w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Predictions...
                </>
              ) : selections.length === 0 ? (
                "Make selections to continue"
              ) : (
                "Save Predictions"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionDialog;
