export function formatCurrency(amount: number | null | undefined, currency: string = '₹'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0.00`;
  }
  return `${currency}${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('en-IN');
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toString();
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(1)}%`;
}

export function formatDateSafe(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr === 'Unknown Date' || dateStr.trim() === '') {
    return 'Date not available';
  }
  return dateStr;
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || isNaN(hours)) {
    return '0h';
  }
  return `${hours.toLocaleString('en-IN', { maximumFractionDigits: 1 })} hrs`;
}
