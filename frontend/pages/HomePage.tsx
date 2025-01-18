import React, { useState } from "react";
import { Calendar, Trophy, Timer } from "lucide-react";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";



function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1920&auto=format&fit=crop",
      title: "NEW SEASON OFFER",
      subtitle: "REGISTER & GET ₦100 IN FREE BETS",
    },
    {
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1920&auto=format&fit=crop",
      title: "PREMIER LEAGUE",
      subtitle: "BET ON YOUR FAVORITE TEAMS",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Hero Slider */}
      <div className="relative h-[400px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center text-white">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-6">{slide.subtitle}</p>
                <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                  JOIN NOW
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Game Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="inline-block p-3 bg-yellow-100 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold">PREDICTOR</h3>
          </div>
          <div className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="inline-block p-3 bg-green-100 rounded-full">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold">FANTASY</h3>
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How to Play Predictor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
                <Timer className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Play For Free</h3>
              <p className="text-gray-600">Predict the scores of the 6 football matches (excluding extra time).</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compete for Bragging Rights</h3>
              <p className="text-gray-600">Compete against fans and fellow SuperPicks players for Bragging Rights</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Every Week</h3>
              <p className="text-gray-600">Come back everyweek and play Predictor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
