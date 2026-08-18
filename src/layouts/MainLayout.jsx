import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import EventTrackerDrawer from '../components/common/EventTrackerDrawer';

export default function MainLayout() {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleTelemetry={() => setIsTelemetryOpen(!isTelemetryOpen)} />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <EventTrackerDrawer 
        isOpen={isTelemetryOpen} 
        onClose={() => setIsTelemetryOpen(false)} 
      />
    </div>
  );
}
