import React, { useRef, useState } from "react";
import { Share2, Twitter, Facebook, Trophy, XCircle, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { formatStakeAmount } from "./Banner";

interface WagerCompletedProps {
  isWon: boolean;
  amount: number;
  matches?: any[]; // Make matches optional
  date: string;
  totalSelectedMatches: number;
}

const StakeResults: React.FC<WagerCompletedProps> = ({ isWon, amount, matches = [], date, totalSelectedMatches }) => {
  const resultCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  // Emojis based on win/loss state
  const resultEmoji = isWon ? "🎉🏆" : "😔💸";
  const resultText = isWon ? "Wager Won!" : "Wager Lost";

  const shareText = `I just ${isWon ? "won" : "lost"} $${formatStakeAmount(amount)} on my sports predictions! ${resultEmoji}`;

  const handleShare = (platform: "twitter" | "facebook") => {
    const url = window.location.href;
    const encodedText = encodeURIComponent(shareText);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const handleSaveImage = async () => {
    if (resultCardRef.current === null) return;
    setIsSharing(true);

    try {
      const shareContainer = document.getElementById("share-container");
      const originalDisplay = shareContainer.style.display;
      shareContainer.style.display = "none";

      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.95,
        backgroundColor: "#1f2937", // bg-gray-900
      });

      shareContainer.style.display = originalDisplay;

      const link = document.createElement("a");
      link.download = `wager-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700" ref={resultCardRef}>
          <div className="p-8">
            {/* Brand name added at the top */}

            <div className="text-center border-b border-gray-700 pb-6 mb-6">
              <div
                className={`mx-auto ${isWon ? "bg-amber-500/10" : "bg-gray-700/50"} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
              >
                {isWon ? <Trophy className="h-8 w-8 text-amber-500" /> : <XCircle className="h-8 w-8 text-gray-400" />}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {resultEmoji} {resultText} {resultEmoji}
              </h2>
              <p className="text-gray-400">{date}</p>
              <div className="mt-2 text-sm text-gray-500 opacity-70">@pickABoom</div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg">
                <span className="text-gray-400">Amount Wagered</span>
                <span className={`text-2xl font-bold ${isWon ? "text-green-500" : "text-red-500"}`}>
                  {formatStakeAmount(amount)} APT
                </span>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-gray-400">Total Wagered Matches</p>
                <p className="text-2xl font-bold text-white">{totalSelectedMatches}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="share-container" className="mt-6 space-y-4">
          <button
            onClick={handleSaveImage}
            disabled={isSharing}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:from-amber-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* <div className="flex space-x-3">
            <button
              onClick={() => handleShare("twitter")}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StakeResults;
