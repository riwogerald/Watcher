import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SkipToContent } from '../Accessibility/SkipToContent';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SkipToContent />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 overflow-y-auto" role="main" aria-label="Main content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
