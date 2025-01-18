import React from "react";
import { ArrowLeft, Trophy, Coins, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-white hover:text-blue-200">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Link>
            <h1 className="text-xl font-bold">How to Play</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Creating Wagers */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-yellow-600 flex items-center">
                <Trophy className="h-6 w-6 mr-2" />
                Create Your Wager
              </h2>
              <p className="text-gray-600">
                Start by creating a wager listing. Select multiple matches from available games . You'll need to stake
                your APT tokens when creating the wager. This creates a head-to-head challenge that other users can
                accept.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <Coins className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Pro tip: Make sure to consider the match schedule . Your staked tokens will be locked until the
                    wager is either paired or you cancel it.
                  </p>
                </div>
              </div>
            </div>

            {/* Pairing Wagers */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-blue-600 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Pair Existing Wagers
              </h2>
              <p className="text-gray-600">
                Browse through available wager listings and choose one to pair. You'll see the matches selected by the
                creator and their stake amount. To pair a wager, you'll need to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Match the original stake amount in APT tokens</li>
                <li>Make your own predictions for the selected matches</li>
                <li>Confirm the pairing transaction</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <Coins className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Check each match schedules carefully before pairing. Once confirmed on the blockchain, your
                    predictions cannot be modified.
                  </p>
                </div>
              </div>
            </div>

            {/* Winning Conditions */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-green-600 flex items-center">
                <Trophy className="h-6 w-6 mr-2" />
                Winning and Rewards
              </h2>
              <p className="text-gray-600">
                After all selected matches are completed, the winner is determined by our edge servers and the smart
                contract automatically pays out to the winner . If the pairer's predictions match the actual match
                results the pairer wins otherwuse the creator does.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <Coins className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    Important: Predictions are compared against real-world match results. Make sure to check your
                    predictions carefully before confirming, as they cannot be changed once submitted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
