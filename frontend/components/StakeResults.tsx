import React, { useRef, useState } from "react";
import { Share2, QrCode, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { formatStakeAmount } from "./Banner";
import { formatAddress } from "@/utils/stakeUtils";
import QRCodeGenerator from "./QRCodeGenerator";

interface WagerCompletedProps {
  isWon: boolean;
  amount: number;
  matches?: any[];
  date: string;
  totalSelectedMatches: number;
  address: string;
  stType: string;
}

const StakeResults: React.FC<WagerCompletedProps> = ({
  isWon,
  amount,
  matches = [],
  date,
  totalSelectedMatches,
  address,
  stType,
}) => {
  const resultCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const amt = formatStakeAmount(amount) * 2;

  const handleSaveImage = async () => {
    if (resultCardRef.current === null) return;
    setIsSharing(true);

    try {
      const shareContainer = document.getElementById("share-container");
      const originalDisplay = shareContainer.style.display;
      shareContainer.style.display = "none";

      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.95,
        backgroundColor: "#000000",
      });

      shareContainer.style.display = originalDisplay;

      const link = document.createElement("a");
      link.download = `weex-trade-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] text-white ">
      <div ref={resultCardRef}>
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-dark">
          <div className="flex items-center">
            <span className="text-amber-500 text-2xl font-bold">PickABoom</span>
          </div>
          {/* <div className="text-gray-300">0xc..</div> */}
        </header>

        {/* Main Content */}
        <div className="relative">
          {/* Trading Info */}
          <div className="p-6 z-10 relative">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-2xl font-bold">{formatAddress(address)}</h1>
              <span className="bg-gray-800 text-sm px-2 py-1 rounded">{stType}</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <span className={isWon ? "text-emerald-400" : "text-red-400"}>{isWon ? "Won" : "Lost"}</span>
              <span className="text-gray-300">|</span>
              <span className="text-xl">2x</span>
            </div>

            {/* Profit Percentage */}
            <div className={`${isWon ? "text-emerald-400" : "text-red-400"} text-2xl font-bold mb-8`}>
              {isWon ? "+" : "-"}
              {isWon ? amt : formatStakeAmount(amount)} APT
            </div>

            {/* Price Info */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Amount</span>
                <span className="text-white text-xs">{formatStakeAmount(amount)} APT</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Matches</span>
                <span className="text-white">{totalSelectedMatches}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Time</span>
                <span className="text-white">{date}</span>
              </div>
            </div>

            {/* Referral Section */}
            <div className="bg-gray-900/50 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-4">
                {/* <QrCode className="w-24 h-24 text-white" /> */}
                <QRCodeGenerator url="https://pickaboom.xyz" openInNewTab={true} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400">Join</span>
                    <span className="text-white font-mono">Now</span>
                  </div>
                  <p className="text-gray-400 text-sm">Wager and claim up to 20,000 APT!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-50">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div id="share-container" className="p-6">
        <button
          onClick={handleSaveImage}
          disabled={isSharing}
          className="w-full flex items-center justify-center px-4 py-4 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:from-amber-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Save as Image
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StakeResults;
