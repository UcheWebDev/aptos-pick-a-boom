import { useState } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft, ChevronDown } from "lucide-react";

const Stake = () => {
  const [amount, setAmount] = useState("");

  const shortenAddress = (address: any) => {
    return `${address.slice(0, 18)}...`;
  };

  const address =
    "0x7be51d04d3a482fa056bc094bc5eadad005aaf823a95269410f08730f0d03cb4";
  const presetAmounts = [1000, 5000, 10000, 25000];
  const balance = 33.69;

  return (
    <div className="max-w-lg mx-auto border p-4 min-h-screen">
      <div className="flex items-center mb-6">
        {/* <ArrowLeft className="w-6 h-6" /> */}
        <h1 className="text-lg font-semibold flex-1 ml-2">STAKE</h1>
        <Link to="/" className="text-2xl">
          &times;
        </Link>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-between">
        <div className="text-gray-600 text-sm mb-1">Balance</div>
        <div className="text-xl font-bold">APT {balance.toFixed(2)}</div>
      </div>

      {/* <div className="flex justify-center mb-6">
        <img
          src="/api/placeholder/120/40"
          alt="BetKing Logo"
          className="h-10"
        />
      </div> */}

      <div className="mb-6">
        <div className="bg-gray-50 rounded-xl p-3 mb-2">
          <label className="text-blue-600"> Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent outline-none mt-1"
            placeholder="Enter Amount USD"
          />
        </div>

        <div className="flex justify-between gap-2 mb-4">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className="flex-1 py-2 text-blue-600"
            >
              +{preset.toLocaleString()}
            </button>
          ))}
        </div>

        {/* <div className="flex justify-between text-sm mb-4">
          <span>Min Stake (APT {balance})</span>
          <a href="#" className="text-blue-600">
            Why?
          </a>
        </div> */}
      </div>

      <div className="mb-6">
        <div className="flex items-center p-3 bg-gray-50 rounded">
          <div className="flex items-center flex-1">
            <div className="ml-2">
              <div>{shortenAddress(address)} </div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* <div className="flex justify-between items-center mb-6">
        <div>Withdrawal amount</div>
        <div className="text-xl font-bold">APT {amount || "0.00"}</div>
      </div> */}

      <div className="flex gap-4">
        <button className="flex-1 py-3 text-center  border border-blue-600 text-blue-600 rounded-full">
          PROCEED
        </button>
      </div>

      {/* <div className="text-center mt-4 text-sm text-gray-600">
        4 out of 4 withdrawals left for today
      </div> */}
    </div>
  );
};

export default Stake;
