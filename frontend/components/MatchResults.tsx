import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, CheckCircle2, XCircle, ArrowRight, Share2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toPng } from "html-to-image";

const MatchResults = ({ data }) => {
  const { account } = useWallet();
  const resultCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const isWinner = data.winner === account?.address;
  const allCorrect = data.correctPredictions === data.totalPredictions;

  const getPredictionDisplay = (prediction, homeTeamName, awayTeamName) => {
    switch (prediction) {
      case "home":
        return `${homeTeamName} Win`;
      case "away":
        return `${awayTeamName} Win`;
      case "draw":
        return "Draw";
      default:
        return prediction.charAt(0).toUpperCase() + prediction.slice(1);
    }
  };

  const handleShare = async () => {
    if (resultCardRef.current === null) return;
    setIsSharing(true);

    try {
      // Temporarily hide the buttons container
      const buttonsContainer = document.getElementById("buttons-container");
      const originalDisplay = buttonsContainer.style.display;
      buttonsContainer.style.display = "none";

      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.95,
        backgroundColor: "#1f2937", // Match dark background
      });

      // Restore the buttons container
      buttonsContainer.style.display = originalDisplay;

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.download = `prediction-results-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-76px)] p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-gray-800 border-gray-700" ref={resultCardRef}>
          <CardHeader className="text-center border-b border-gray-700">
            <div
              className={`mx-auto ${isWinner ? "bg-amber-500/10" : "bg-gray-700/50"} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
            >
              <Trophy className={`h-8 w-8 ${isWinner ? "text-amber-500" : "text-gray-400"}`} />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {isWinner ? "Congratulations!" : "Stake Complete"}
            </CardTitle>
            <p className="text-gray-400">
              {data.correctPredictions} correct out of {data.totalPredictions} predictions
              {data.requiredPicks && ` (${data.requiredPicks} required to win)`}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.results.map((result, index) => (
                <div key={result.match_id} className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${result.correct ? "bg-green-500/10" : "bg-red-500/10"} p-2 rounded-full`}>
                      {result.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="mb-2">
                        <p className="text-white font-medium">{result.actual_scores.homeTeamName}</p>
                        <p className="text-white font-medium">{result.actual_scores.awayTeamName}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">
                          {result.actual_scores.home} - {result.actual_scores.away}
                        </span>
                        <span className="text-sm text-gray-400">Final Score</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Your Prediction:{" "}
                        {getPredictionDisplay(
                          result.prediction,
                          result.actual_scores.homeTeamName,
                          result.actual_scores.awayTeamName,
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${result.correct ? "bg-green-500/10" : "bg-red-500/10"} px-3 py-1 rounded-full h-fit`}
                  >
                    <span className={`${result.correct ? "text-green-500" : "text-red-500"} text-sm font-medium`}>
                      {result.correct ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center space-y-4">
              {data.message && (
                <div className={`${isWinner ? "bg-amber-500/10" : "bg-gray-700/50"} p-4 rounded-lg text-center w-full`}>
                  <p className={`${isWinner ? "text-amber-500" : "text-gray-400"} font-semibold`}>{data.message}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Buttons container outside the captured area */}
        <div id="buttons-container" className="mt-6 flex justify-center gap-4">
          <Link
            to="/super-picks"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-pink-600 transition-all duration-300"
          >
            <span>Return to Stake Listings</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share Results</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
