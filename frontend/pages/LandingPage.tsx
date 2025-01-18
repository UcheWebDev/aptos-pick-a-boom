import React, { useState } from 'react';
import { HeroSlider } from "../components/HeroSlider";
import { Tab } from "../types/bet";
import { TabButton } from "../components/TabButton";
import { BetsTable } from "../components/BetsTable";
import { mockBets } from "../data/mockBets";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('casino');

  return (
    <>
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Live Bets</h1>
        <p className="text-gray-400 text-center mb-8">
          Check out the live bets on popular Casino games and Sports to discover how much you could win.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <TabButton label="Casino" isActive={activeTab === "casino"} onClick={() => setActiveTab("casino")} />
          <TabButton label="Sports" isActive={activeTab === "sports"} onClick={() => setActiveTab("sports")} />
        </div>

        <BetsTable bets={mockBets} />
      </div>
    </>
  );
};

export default LandingPage;
