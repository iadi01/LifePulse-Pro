import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { TransactionDetailDrawer } from '../../features/transactions/TransactionDetailDrawer';
import { ArtistDetailModal } from '../../features/listening/ArtistDetailModal';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchInitialData } = useDataStore();
  const { theme } = useUIStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {/* Dedicated Mobile Navigation */}
      <MobileNav />

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Global Transaction Inspection Drawer */}
      <TransactionDetailDrawer />

      {/* Global Artist Inspection Modal */}
      <ArtistDetailModal />
    </div>
  );
};
