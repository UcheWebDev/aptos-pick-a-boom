import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletSelector } from "../components/WalletSelector";

import {
  ChevronLeft,
  X,
  ChevronDown,
  Layers,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatter";

const Modal = ({ isOpen, onClose, result }) => {
  const betDetails = {
    date: "02.04.2024",
    time: "11:13",
    betId: "48160651439",
    events: 10,
    eventsCompleted: 10,
    odds: 118.318,
    bet: 1000,
    winnings: 118318.74,
    status: "Paid out",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-gray-800 text-xs md:text-sm font-semibold">Pick Details</h3>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center relative">
              <Layers className="w-8 h-8 text-blue-900" />
              <CheckCircle className="w-6 h-6 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-xs md:text-sm">{`${betDetails.date} (${betDetails.time})`}</div>
              <h2 className="text-xs md:text-sm font-bold text-gray-900 mt-1">
                Accumulator
              </h2>
              <div className="text-gray-500 mt-1 text-xs md:text-sm">№ {betDetails.betId}</div>
            </div>
          </div>

          {/* Bet Stats */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-900" />
                <span className="text-gray-700 text-xs md:text-sm">
                  Events: {betDetails.events}
                </span>
              </div>
              <span className="text-gray-900 font-medium text-xs md:text-sm">
                {betDetails.eventsCompleted} of {betDetails.events} completed
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs md:text-sm">Odds:</span>
                <span className="text-gray-900 font-semibold text-xs md:text-sm">
                  {betDetails.odds.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs md:text-sm">Bet:</span>
                <span className="text-gray-900 font-semibold text-xs md:text-sm">
                  {formatCurrency(betDetails.bet)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs md:text-sm">Winnings:</span>
                <span className="text-green-500 font-bold text-xs md:text-sm">
                  {formatCurrency(betDetails.winnings)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs md:text-sm">Status:</span>
                <span className="text-green-500 font-bold text-xs md:text-sm">
                  {betDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="pt-4 border-t mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=40&h=40&fit=crop"
                  alt="Football"
                  className="w-6 h-6 object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-medium text-gray-900">
                  Football. Czech Republic Cup
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">02 Apr 2024 (17:00)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/bet"
            className="text-xs md:text-sm flex items-center justify-center gap-2 bg-blue-900 text-white py-3 px-4 rounded-xl font-semibold
            hover:bg-blue-900 active:bg-blue-800 transition-colors"
          >
            Proceed
          </Link>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ selectedAmount, onSelectAmount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const amounts = [
    { label: "All Amounts", value: 0 },
    { label: "₦5 Million", value: 5000000 },
    { label: "₦10 Million", value: 10000000 },
    { label: "₦20 Million", value: 20000000 },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100  text-xs md:text-sm text-gray-900 px-4 py-2 rounded-lg flex items-center justify-between w-48"
      >
        <span>
          {amounts.find((a) => a.value === selectedAmount)?.label ||
            "Select Amount"}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10">
          {amounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => {
                onSelectAmount(amount.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                selectedAmount === amount.value
                  ? `text-gray-800`
                  : "text-gray-800"
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FootballPick11 = () => {
  const [activeTab, setActiveTab] = useState("RESULTS");
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allResults = [
    { id: 1, date: "Saturday 02/11", time: "1:30pm", winAmount: 10000000 },
    { id: 2, date: "Sunday 27/10", time: "3:00pm", winAmount: 5000000 },
    { id: 3, date: "Sunday 20/10", time: "2:00pm", winAmount: 20000000 },
    { id: 4, date: "Saturday 12/10", time: "3:00pm", winAmount: 10000000 },
    { id: 5, date: "Sunday 06/10", time: "1:00pm", winAmount: 5000000 },
  ];

  const filteredResults =
    selectedAmount === 0
      ? allResults
      : allResults.filter((result) => result.winAmount === selectedAmount);

  const handleResultClick = (result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const Pick11sContent = () => (
    <div className="p-4">
      <div className="text-white">Pick 11s Content</div>
    </div>
  );

  const ResultsContent = () => (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <FilterDropdown
          selectedAmount={selectedAmount}
          onSelectAmount={setSelectedAmount}
        />
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-240px)] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            onClick={() => handleResultClick(result)}
            className=" border-gray-500 bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div
              className={`bg-blue-900 rounded-lg text-center text-white text-xs md:text-sm w-20 px-2 py-1 mb-2 `}
            >
              PICK 11
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-xs md:text-sm">
                ${(result.winAmount / 1000000).toFixed(0)} MILLION
              </div>
              <div className="text-right text-gray-800 text-xs md:text-sm">
                <div className="text-blue-600">
                  <span className="text-gray-500 ">Stake Opened </span> @{" "}
                  {result.time}
                </div>
                <div className="text-gray-500">{result.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
     
      <div className="flex justify-center fixed top-0 left-0 right-0">
        <header className="bg-white px-4 py-4 flex items-center justify-between max-w-4xl w-full">
          <div className="flex justify-between items-center gap-4 ">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-xs md:text-sm font-semibold text-gray-900">Markets</h1>
          </div>
          <div className="relative">
            <WalletSelector />
          </div>
        
        </header>
      </div>
      <div className="max-w-2xl mx-auto p-6 pt-24">
        <div className="bg-white p-6 space-y-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("RESULTS")}
              className={`flex-1 text-xs md:text-sm px-4 py-3 text-center transition-colors duration-200 ${
                activeTab === "RESULTS"
                  ? "text-white bg-blue-900 rounded-lg border-b-2 border-white"
                  : "text-gray-500"
              }`}
            >
              OPEN
            </button>
            <button
              onClick={() => setActiveTab("PICK 11S")}
              className={`flex-1 text-xs md:text-sm px-4 py-3 text-center transition-colors duration-200 ${
                activeTab === "PICK 11S"
                  ? "text-white bg-blue-900 rounded-lg border-b-2 border-white"
                  : "text-gray-900"
              }`}
            >
              RESULTS{" "}
            </button>
          </div>

          <div className="border-gray-800 flex-1">
            {activeTab === "PICK 11S" ? <Pick11sContent /> : <ResultsContent />}
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          result={selectedResult}
        />
      </div>
    </div>
  );
};

export default FootballPick11;
