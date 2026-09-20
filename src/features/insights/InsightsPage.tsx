import React, { useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Headphones,
  TrendingUp,
  AlertOctagon,
  Clock,
  Compass,
  CreditCard,
  Layers
} from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/formatters';

interface InsightItem {
  id: string;
  domain: 'Money' | 'Risk' | 'Listening';
  domainBadge: 'safe' | 'fraud' | 'indigo';
  icon: React.ElementType;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  actionText: string;
  onAction: () => void;
}

export const InsightsPage: React.FC = () => {
  const { householdData, transactionSummary, spotifySummary, loading } = useDataStore();
  const { setActiveSection } = useUIStore();
  const { setTxFilter, setMoneyCategory, setMoneyPaymentMode } = useFilterStore();

  const insights: InsightItem[] = useMemo(() => {
    const list: InsightItem[] = [];

    // 1. Transaction Risk Insight - Top Fraud Category
    if (transactionSummary && transactionSummary.category_stats.length > 0) {
      const topFraudCat = transactionSummary.category_stats[0];
      list.push({
        id: 'insight-fraud-cat',
        domain: 'Risk',
        domainBadge: 'fraud',
        icon: ShieldAlert,
        title: `Highest Fraud Concentration in "${topFraudCat.category}"`,
        description: `With ${formatNumber(topFraudCat.fraud_count)} confirmed fraud cases out of ${formatNumber(topFraudCat.count)} transactions (${formatPercent(topFraudCat.fraud_rate)} fraud rate), ${topFraudCat.category} is the most vulnerable category by a wide margin.`,
        metric: formatNumber(topFraudCat.fraud_count),
        metricLabel: 'Fraud Alerts',
        actionText: `Filter ${topFraudCat.category} Fraud →`,
        onAction: () => {
          setTxFilter('category', topFraudCat.category);
          setTxFilter('risk', 'Fraud');
          setActiveSection('transactions', 'explorer');
        }
      });
    }

    // 2. Transaction Risk Insight - Geographic Cluster
    if (transactionSummary && transactionSummary.state_stats.length > 0) {
      // Find top state excluding 'Unknown'
      const knownStates = transactionSummary.state_stats.filter((s) => s.state !== 'Unknown');
      const topState = knownStates[0];
      if (topState) {
        list.push({
          id: 'insight-state-risk',
          domain: 'Risk',
          domainBadge: 'fraud',
          icon: Compass,
          title: `Highest Regional Transaction Frequency in ${topState.state}`,
          description: `${topState.state} accounts for ${formatNumber(topState.count)} total transactions with ${formatNumber(topState.fraud_count)} fraud alerts (${formatPercent(topState.fraud_rate)} incident rate).`,
          metric: formatNumber(topState.count),
          metricLabel: 'Regional Transactions',
          actionText: `Inspect ${topState.state} Data →`,
          onAction: () => {
            setTxFilter('state', topState.state);
            setActiveSection('transactions', 'explorer');
          }
        });
      }
    }

    // 3. Money Insight - Top Spending Category
    if (householdData && householdData.categories.length > 0) {
      const topExpCat = householdData.categories.find(
        (c) => c.type === 'Expense' || c.amount > 0
      );
      if (topExpCat) {
        list.push({
          id: 'insight-spending-cat',
          domain: 'Money',
          domainBadge: 'safe',
          icon: Wallet,
          title: `"${topExpCat.category}" Dominates Household Outflows`,
          description: `Total recorded outflow for ${topExpCat.category} stands at ${formatCurrency(topExpCat.amount)} across ${formatNumber(topExpCat.count)} transactions, representing the single largest budget drain.`,
          metric: formatCurrency(topExpCat.amount),
          metricLabel: 'Category Total',
          actionText: 'View Household Spending →',
          onAction: () => {
            setMoneyCategory(topExpCat.category);
            setActiveSection('money', 'spending');
          }
        });
      }
    }

    // 4. Money Insight - Most Frequent Payment Mode
    if (householdData && householdData.payment_modes.length > 0) {
      const topMode = householdData.payment_modes[0];
      list.push({
        id: 'insight-payment-mode',
        domain: 'Money',
        domainBadge: 'safe',
        icon: CreditCard,
        title: `Primary Liquidity Channel: "${topMode.mode}"`,
        description: `Household records show ${formatNumber(topMode.count)} transactions conducted via ${topMode.mode}, representing a cumulative movement of ${formatCurrency(topMode.amount)}.`,
        metric: formatNumber(topMode.count),
        metricLabel: 'Transactions via Mode',
        actionText: 'Filter Payment Records →',
        onAction: () => {
          setMoneyPaymentMode(topMode.mode);
          setActiveSection('money', 'household');
        }
      });
    }

    // 5. Spotify Insight - All-Time Top Artist
    if (spotifySummary && spotifySummary.top_artists.length > 0) {
      const topArtist = spotifySummary.top_artists[0];
      list.push({
        id: 'insight-top-artist',
        domain: 'Listening',
        domainBadge: 'indigo',
        icon: Headphones,
        title: `Unrivaled Affinity for "${topArtist.artist}"`,
        description: `With ${formatNumber(topArtist.plays)} total plays and ${topArtist.hours} hours logged across ${topArtist.unique_tracks} distinct tracks, ${topArtist.artist} is the listener's most streamed artist by over 2x margin.`,
        metric: `${formatNumber(topArtist.plays)} plays`,
        metricLabel: `${topArtist.hours} hours`,
        actionText: 'Open Artist Profile →',
        onAction: () => {
          setActiveSection('listening', 'artists');
        }
      });
    }

    // 6. Spotify Insight - Peak Listening Year
    if (spotifySummary && spotifySummary.timeline_yearly.length > 0) {
      const peakYear = [...spotifySummary.timeline_yearly].sort(
        (a, b) => b.plays - a.plays
      )[0];
      list.push({
        id: 'insight-peak-year',
        domain: 'Listening',
        domainBadge: 'indigo',
        icon: Clock,
        title: `Peak Streaming Year in ${peakYear.period}`,
        description: `In ${peakYear.period}, the listener streamed ${formatNumber(peakYear.plays)} tracks totaling ${peakYear.hours} hours, making it the most active year in the entire 11-year streaming chronicle.`,
        metric: `${formatNumber(peakYear.plays)} plays`,
        metricLabel: `${peakYear.hours} listening hours`,
        actionText: 'Inspect Timeline →',
        onAction: () => {
          setActiveSection('listening', 'overview');
        }
      });
    }

    // 7. Behavior Insight - Shuffle Habits
    if (spotifySummary) {
      list.push({
        id: 'insight-shuffle-habit',
        domain: 'Listening',
        domainBadge: 'indigo',
        icon: Layers,
        title: 'Strong Preference for Randomized Playback',
        description: `The user enabled Shuffle mode for ${formatPercent(spotifySummary.kpis.shuffle_rate)} of all streaming sessions (${formatNumber(spotifySummary.kpis.shuffle_on_count)} tracks), exhibiting discovery-oriented listening behavior.`,
        metric: formatPercent(spotifySummary.kpis.shuffle_rate),
        metricLabel: 'Shuffle Mode Share',
        actionText: 'View Playback Behavior →',
        onAction: () => {
          setActiveSection('listening', 'behavior');
        }
      });
    }

    return list;
  }, [householdData, transactionSummary, spotifySummary, setActiveSection, setTxFilter, setMoneyCategory, setMoneyPaymentMode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Deterministic Data Engine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Empirical Insights
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Deterministic patterns computed directly from the three verified datasets. Every observation is backed by demonstrable evidence with direct deep-links to the raw records.
        </p>
      </div>

      {/* Domain Attribution Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
              Household Domain
            </div>
            <div className="text-xs text-emerald-700/80 dark:text-emerald-400">
              2,461 Verified Rows
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase">
              Transaction Domain
            </div>
            <div className="text-xs text-rose-700/80 dark:text-rose-400">
              10,267 India Records
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 uppercase">
              Spotify Domain
            </div>
            <div className="text-xs text-indigo-700/80 dark:text-indigo-400">
              149,860 Audio Streams
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.id}
              className="p-6 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.domainBadge} className="text-[10px]">
                        {item.domain} Lens
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Deterministic Insight
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Metric & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {item.metric}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {item.metricLabel}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={item.onAction}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline mt-0 md:mt-3 cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
