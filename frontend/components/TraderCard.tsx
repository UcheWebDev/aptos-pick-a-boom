import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CircleUserRound, MessageCircle, ArrowRight } from "lucide-react";
import Modal from "../components/Modal";

export interface TraderProps {
  name: string;
  price: number;
  trades: number;
  success: number;
  amount: string;
  limit: string;
  status: "open" | "closed";
}

export const TraderCard: React.FC<TraderProps> = ({ name, price, trades, success, amount, limit, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirmBet = () => {
    setIsModalOpen(false);
    navigate("/matches-page");
  };

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleUserRound className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-gray-800">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{trades} Trades</span>
            <span>{success}%</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-gray-600 text-sm">Price</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{price.toFixed(2)}</span>
          <span className="text-gray-600">INR</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Crypto Amount</span>
          <span className="text-gray-800">{amount} USDT</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Limit</span>
          <span className="text-gray-800">{limit}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-gray-100 p-2 rounded-md">
          <MessageCircle className="w-5 h-5 mx-auto text-gray-600" />
        </button>
        <button className="flex-1 bg-gray-100 p-2 rounded-md">
          <ArrowRight className="w-5 h-5 mx-auto text-gray-600" />
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          disabled={status === "closed"}
        >
          Enter
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Your Bet">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Stake Amount:</span>
              <span className="font-semibold">₦1000</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Potential Win:</span>
              <span className="font-semibold text-green-600">₦1000 </span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            By clicking confirm, you agree to place this bet with the specified parameters.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBet}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Enter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
