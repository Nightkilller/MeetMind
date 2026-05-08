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
        className={`pt-[54px] min-h-screen ${showSidebar ? 'pl-60' : ''}`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
