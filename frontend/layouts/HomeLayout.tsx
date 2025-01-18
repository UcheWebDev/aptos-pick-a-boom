import React, { useState } from "react";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
// import { SliderCard } from "@/components/slider-card";
import { TopNav } from "@/components/TopNav";

const HomeLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-slate-800">
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen ml-0 ">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />

          <div className="p-4 space-y-6">
            {/* <HeroSlider /> */}
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomeLayout;
