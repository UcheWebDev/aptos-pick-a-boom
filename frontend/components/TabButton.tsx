import React from "react";
import { Tab } from "../types/bet";

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-medium transition-colors ${
        isActive ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
