'use client';

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function PageWrapper({ children, showSidebar = true }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {showSidebar && <Sidebar />}
      <main
        className={`pt-[54px] min-h-screen pb-[64px] md:pb-0 ${showSidebar ? 'md:pl-60' : ''}`}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
