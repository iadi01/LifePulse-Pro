import React, { useEffect } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Calendar,
  Building2,
  Tag,
  CreditCard,
  User,
  Briefcase
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDateSafe } from '../../lib/formatters';

export const TransactionDetailDrawer: React.FC = () => {
  const { selectedTransaction, setSelectedTransaction } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTransaction) {
        setSelectedTransaction(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTransaction, setSelectedTransaction]);

  if (!selectedTransaction) return null;

  const tx = selectedTransaction;

  const riskBadgeVariant =
    tx.risk === 'Fraud' ? 'fraud' : tx.risk === 'Safe' ? 'safe' : 'unknown';

  const riskIcon =
    tx.risk === 'Fraud' ? (
      <ShieldAlert className="h-5 w-5 text-rose-600" />
    ) : tx.risk === 'Safe' ? (
      <ShieldCheck className="h-5 w-5 text-emerald-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-amber-600" />
    );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setSelectedTransaction(null)}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
              #{tx.id}
            </span>
            <Badge variant={riskBadgeVariant} className="text-xs">
              {tx.risk === 'Fraud' && '▲ Fraud-marked'}
              {tx.risk === 'Safe' && '● Safe'}
              {tx.risk === 'Unknown' && '? Unknown'}
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => setSelectedTransaction(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Amount & Merchant */}
        <div className="p-6 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(tx.amount)}
          </div>
          <div className="text-base font-semibold text-slate-700 dark:text-slate-200 mt-1 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            {tx.merchant}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            {tx.category}
          </div>
        </div>

        {/* Detail Sections */}
        <div className="p-6 space-y-6">
          {/* Section 1: Risk Assessment */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risk Signal
            </div>
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              tx.risk === 'Fraud'
                ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                : tx.risk === 'Safe'
                ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                {riskIcon}
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm">
                  {tx.risk === 'Fraud' ? 'Confirmed Fraud Signal' : tx.risk === 'Safe' ? 'Legitimate Transaction' : 'Unclassified / Ambiguous'}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {tx.risk === 'Fraud'
                    ? 'Flagged by fraud pattern detection system. Category and merchant characteristics show high vulnerability.'
                    : tx.risk === 'Safe'
                    ? 'Verified non-fraudulent transaction pattern.'
                    : 'The source data contains an unclassified null value. Retained as Unknown per strict data audit rules.'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Transaction Timing & Payment Method */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Transaction Details
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Timestamp
                </span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 block">
                  {formatDateSafe(tx.date)}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> Masked Card
                </span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 block">
                  {tx.masked_cc}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Geographic Intelligence */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Location & Spatial Signals
            </div>
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <MapPin className="h-4 w-4 text-indigo-600" />
                {tx.city}, {tx.state}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 font-semibold">User Coordinates</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {tx.lat ? `${tx.lat}, ${tx.long}` : 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 font-semibold">Origin State</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{tx.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Customer Profile (Privacy Safe) */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Customer Profile
            </div>
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Customer Name
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{tx.customer}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Profession / Job
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">{tx.job}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Gender</span>
                <span className="text-slate-700 dark:text-slate-300 uppercase">{tx.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-950/40 text-[11px] text-slate-400 text-center">
          Sensitive customer PII and full card numbers are redacted by privacy policy. Press ESC to close.
        </div>
      </div>
    </div>
  );
};
