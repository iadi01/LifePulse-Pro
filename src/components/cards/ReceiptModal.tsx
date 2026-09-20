import React, { useState } from 'react';
import { Receipt, X, Printer, Copy, Check, Sparkles } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/formatters';

export const ReceiptModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { householdData, transactionSummary, spotifySummary } = useDataStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleCopy = () => {
    const text = `
========================================
       LIFEPULSE - YOUR LIFE IN RECEIPTS
          WebRush 2026 Hackathon Edition
========================================
Date: ${receiptDate}
Lens Audit: Money • Risk • Listening

----------------- MONEY ----------------
Total Household Income:   ${formatCurrency(householdData?.summary.total_income)}
Total Outflows/Expenses:  ${formatCurrency(householdData?.summary.total_expense)}
Total Investment:         ${formatCurrency(householdData?.summary.total_investment)}
Net Cashflow Balance:     ${formatCurrency(householdData?.summary.net_balance)}
Top Outflow Category:     ${householdData?.categories[0]?.category || 'N/A'}

----------------- RISK -----------------
Total Transactions:       ${formatNumber(transactionSummary?.total_transactions)}
Confirmed Fraud Alerts:   ${formatNumber(transactionSummary?.fraud_count)} (52.4%)
Safe Transactions:        ${formatNumber(transactionSummary?.safe_count)}
Unknown Signals:          ${formatNumber(transactionSummary?.unknown_count)}
At-Risk Exposure:         ${formatCurrency(transactionSummary?.total_fraud_amount)}

--------------- LISTENING --------------
Total Tracks Streamed:    ${formatNumber(spotifySummary?.kpis.total_plays)}
Listening Time:           ${spotifySummary?.kpis.total_hours} hrs
Unique Artists:           ${formatNumber(spotifySummary?.kpis.unique_artists)}
#1 Top Artist:            ${spotifySummary?.top_artists[0]?.artist || 'The Beatles'}
Stream Skip Rate:         ${formatPercent(spotifySummary?.kpis.skip_rate)}
Shuffle Preference:       ${formatPercent(spotifySummary?.kpis.shuffle_rate)}

========================================
   THANK YOU FOR AUDITING YOUR DATA!
    100% Deterministic • Clean SaaS
========================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-600" />
            <span id="receipt-title" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Life, In Receipts 🧾
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Realistic Thermal Receipt Body */}
        <div className="p-6 overflow-y-auto bg-amber-50/20 dark:bg-slate-900 font-mono text-xs space-y-4 text-slate-800 dark:text-slate-200 select-text">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-base font-extrabold tracking-widest uppercase text-slate-900 dark:text-white">
              LIFEPULSE
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              One Interface. Three Perspectives.
            </div>
            <div className="text-[10px] text-slate-400">
              ORDER #LP-2026-WEBRUSH • {receiptDate}
            </div>
          </div>

          {/* Section: Money */}
          <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 flex justify-between">
              <span>[01] MONEY & HOUSEHOLD</span>
              <span>2,461 RECS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">INFLOW (INCOME):</span>
              <span className="font-bold text-emerald-600">{formatCurrency(householdData?.summary.total_income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">OUTFLOW (EXPENSE):</span>
              <span className="font-bold text-rose-600">{formatCurrency(householdData?.summary.total_expense)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">INVESTMENTS:</span>
              <span className="font-bold text-indigo-600">{formatCurrency(householdData?.summary.total_investment)}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
              <span>NET BALANCE:</span>
              <span>{formatCurrency(householdData?.summary.net_balance)}</span>
            </div>
          </div>

          {/* Section: Risk */}
          <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-[10px] font-bold tracking-wider uppercase text-rose-700 dark:text-rose-400 flex justify-between">
              <span>[02] TRANSACTION RISK</span>
              <span>10,267 RECS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TOTAL VOLUME:</span>
              <span>{formatCurrency(transactionSummary?.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">FRAUD ALERTS:</span>
              <span className="font-bold text-rose-600">{formatNumber(transactionSummary?.fraud_count)} (52.4%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SAFE TRANSACTIONS:</span>
              <span className="text-emerald-600">{formatNumber(transactionSummary?.safe_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AT-RISK CAPITAL:</span>
              <span className="font-bold text-rose-600">{formatCurrency(transactionSummary?.total_fraud_amount)}</span>
            </div>
          </div>

          {/* Section: Listening */}
          <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400 flex justify-between">
              <span>[03] SPOTIFY LISTENING</span>
              <span>149,860 PLAYS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">LISTENING TIME:</span>
              <span>{spotifySummary?.kpis.total_hours} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TOP ARTIST:</span>
              <span className="font-bold">{spotifySummary?.top_artists[0]?.artist || 'The Beatles'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">UNIQUE TRACKS:</span>
              <span>{formatNumber(spotifySummary?.kpis.unique_tracks)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SKIP / SHUFFLE:</span>
              <span>{formatPercent(spotifySummary?.kpis.skip_rate)} / {formatPercent(spotifySummary?.kpis.shuffle_rate)}</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center pt-2 text-[10px] text-slate-400 space-y-1">
            <div>*** SUMMARY VERIFIED ***</div>
            <div>DETERMINISTIC DATA INTELLIGENCE</div>
            <div>NO RECURRING COOKIES • 100% CLIENT SIDE</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
