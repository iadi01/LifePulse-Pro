export * from './household'
export * from './transaction'
export * from './spotify'

export type NavSection = 'overview' | 'money' | 'transactions' | 'risk' | 'listening' | 'insights'
export type MoneySubSection = 'all' | 'household' | 'spending'
export type TransactionSubSection = 'all' | 'overview' | 'explorer' | 'risk'
export type ListeningSubSection = 'all' | 'overview' | 'artists' | 'tracks' | 'behavior'
