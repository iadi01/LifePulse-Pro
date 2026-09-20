import React from 'react';
import { useUIStore } from './store/useUIStore';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './features/overview/OverviewPage';
import { MoneyPage } from './features/money/MoneyPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { RiskDashboard } from './features/transactions/RiskDashboard';
import { ListeningPage } from './features/listening/ListeningPage';
import { InsightsPage } from './features/insights/InsightsPage';

export const App: React.FC = () => {
  const { activeSection } = useUIStore();

  const renderCurrentPage = () => {
    switch (activeSection) {
      case 'money':
        return <MoneyPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'risk':
        return <RiskDashboard />;
      case 'listening':
        return <ListeningPage />;
      case 'insights':
        return <InsightsPage />;
      case 'overview':
      default:
        return <OverviewPage />;
    }
  };

  return <AppShell>{renderCurrentPage()}</AppShell>;
};

export default App;
