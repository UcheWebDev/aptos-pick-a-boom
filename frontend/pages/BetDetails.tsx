import { ArrowLeft, MoreVertical, Layers, CheckCircle } from "lucide-react";

export const BetDetails = () => {
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

  const formatCurrency = (amount: number): string => {
    return (
      new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount) + " ₣"
    );
  };

  const handleProceed = () => {
    console.log("Proceeding with bet...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <h1 className="text-2xl font-semibold text-blue-600">Bet details</h1>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-sm border p-6 space-y-6">
          {/* Bet Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center relative">
              <Layers className="w-8 h-8 text-blue-600" />
              <CheckCircle className="w-6 h-6 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500">{`${betDetails.date} (${betDetails.time})`}</div>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Accumulator
              </h2>
              <div className="text-gray-500 mt-1">№ {betDetails.betId}</div>
            </div>
          </div>

          {/* Bet Stats */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  Events: {betDetails.events}
                </span>
              </div>
              <span className="text-gray-900 font-medium">
                {betDetails.eventsCompleted} of {betDetails.events} completed
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Odds:</span>
                <span className="text-gray-900 font-semibold text-xl">
                  {betDetails.odds.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Bet:</span>
                <span className="text-gray-900 font-semibold text-xl">
                  {formatCurrency(betDetails.bet)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Winnings:</span>
                <span className="text-green-500 font-bold text-xl">
                  {formatCurrency(betDetails.winnings)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Status:</span>
                <span className="text-green-500 font-bold text-xl">
                  {betDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=40&h=40&fit=crop"
                  alt="Football"
                  className="w-6 h-6 object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Football. Czech Republic Cup
                </h3>
                <p className="text-gray-500">02 Apr 2024 (17:00)</p>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-6 border-t">
            <button
              onClick={handleProceed}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg
              hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetDetails;
