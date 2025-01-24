import React, { useState } from 'react';
import TopNav from './TopNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gray-50">
      {/* Mobile Navigation */}
      {!isDesktop && (
        <MobileNav 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* Left Sidebar - Hidden on mobile unless opened */}
      <div className={`
        ${isDesktop ? 'relative' : 'fixed inset-y-0 left-0'} 
        ${!isDesktop && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-200 ease-in-out z-20
      `}>
        <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* Main Content Area with Top Nav */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNav 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onNotificationsClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-900">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar - Hidden on mobile unless opened */}
      {/* <div className={`
        ${isDesktop ? 'relative' : 'fixed inset-y-0 right-0'} 
        ${!isDesktop && !isRightSidebarOpen ? 'translate-x-full' : 'translate-x-0'}
        transition-transform duration-200 ease-in-out z-20
      `}>
        <RightSidebar onClose={() => setIsRightSidebarOpen(false)} />
      </div> */}

      {/* Overlay for mobile when either sidebar is open */}
      {!isDesktop && (isSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-10"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;