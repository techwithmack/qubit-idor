export type AllocationSlice = {
  name: string;
  value: number;
  color: string;
};

export type PortfolioPoint = {
  date: string;
  value: number;
};

export type TransactionRecord = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "trade" | "income" | "transfer" | "fee";
};

export type LabUser = {
  id: string;
  name: string;
  email: string;
  title: string;
  totalPortfolioValue: number;
  cashBalance: number;
  allocations: AllocationSlice[];
  portfolioHistory: PortfolioPoint[];
  transactions: TransactionRecord[];
};

export type StatementRecord = {
  id: string;
  userId: string;
  month: string;
  year: number;
  accountLabel: string;
  openingValue: number;
  closingValue: number;
  netChange: number;
  highlights: string[];
};

export type WealthLabData = {
  users: LabUser[];
  statements: StatementRecord[];
};
