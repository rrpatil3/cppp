// ─── Institution / Lender ───────────────────────────────────────────────────

export interface Institution {
  id: string;
  user_id: string;
  institution_name: string;
  los_platform: string | null;
  annual_sba_volume: number;
  state: string | null;
  anthropic_api_key: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Loan Application (borrower being analyzed) ──────────────────────────────

export interface LoanApplication {
  id: string;
  institution_id: string;
  user_id: string;
  borrower_name: string;
  industry: string | null;
  loan_amount_requested: number;
  loan_purpose: string | null;
  employees: number;
  annual_revenue: number;
  net_income: number;
  ebit: number;
  interest_expense: number;
  existing_debt_service: number;
  total_debt: number;
  total_assets: number;
  status: 'pipeline' | 'in-review' | 'approved' | 'declined' | 'on-hold';
  loan_officer_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── DSCR / SBA Ratios ───────────────────────────────────────────────────────

export interface DSCRData {
  netOperatingIncome: number;
  proposedDebtService: number;
  existingDebtService: number;
  ownerSalary: number;
  ownerPerks: number;
  depreciation: number;
  nonRecurring: number;
  taxRate: number;
  annualRevenue: number;
  totalLiabilities: number;
  totalAssets: number;
  totalEquity: number;
}

export interface DSCRResult {
  globalCashFlow: number;
  dscr: number;
  dscrLabel: 'Strong' | 'Acceptable' | 'Marginal' | 'Below Threshold';
  dscrColor: string;
  sde: number;
  adjustedEbitda: number;
  leverageRatio: number;
  workingCapital: number;
  netMargin: number;
  debtToEquity: number;
  sbaHealthScore: number;
}

// ─── Legacy Business (kept for backwards compat) ─────────────────────────────

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  industry: string | null;
  employees: number;
  annual_revenue: number;
  net_income: number;
  ebit: number;
  interest_expense: number;
  business_description: string | null;
  growth_story: string | null;
  competitive_moat: string | null;
  reason_for_sale: string | null;
  owner_role: string | null;
  readiness_clean_books: number;
  readiness_revenue_quality: number;
  readiness_owner_independent: number;
  readiness_no_concentration: number;
  readiness_growing: number;
  anthropic_api_key: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Balance Sheet / Assets ──────────────────────────────────────────────────

export interface BalanceSheetItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  value: number;
  type: 'ASSET' | 'LIABILITY';
  interest_rate: number;
  created_at: string;
}

// ─── Chat / AI ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ─── Cap Table ───────────────────────────────────────────────────────────────

export interface CapTableEntry {
  id: string;
  user_id: string;
  name: string;
  share_class: string;
  shares_held: number;
  purchase_price_per_share: number;
  created_at: string;
}

// ─── Due Diligence ───────────────────────────────────────────────────────────

export interface DueDiligenceCheck {
  id: string;
  user_id: string;
  item_key: string;
  is_complete: boolean;
}

// ─── EBITDA Add-Backs ────────────────────────────────────────────────────────

export interface EbitdaAddBack {
  id: string;
  user_id: string;
  label: string;
  amount: number;
  created_at: string;
}

// ─── Snapshots ───────────────────────────────────────────────────────────────

export interface BusinessSnapshot {
  id: string;
  user_id: string;
  business_id: string;
  annual_revenue: number | null;
  net_income: number | null;
  ebit: number | null;
  health_score: number | null;
  snapshot_date: string;
  created_at: string;
}

// ─── Red Flags ───────────────────────────────────────────────────────────────

export interface RedFlag {
  severity: 'critical' | 'warning' | 'watch';
  title: string;
  detail: string;
  action: string;
}

// ─── After-Tax ───────────────────────────────────────────────────────────────

export interface AfterTaxResult {
  grossSalePrice: number;
  federalTax: number;
  stateTax: number;
  netInvestmentIncomeTax: number;
  totalTax: number;
  netProceeds: number;
  effectiveRate: number;
}

// ─── AI Request Types ────────────────────────────────────────────────────────

export type AiRequestType =
  | 'advisor'
  | 'valuation'
  | 'buyers'
  | 'strategy'
  | 'cim'
  | 'dd-report'
  | 'buyer-view'
  | 'value-drivers'
  | 'credit-memo'
  | 'sba-analysis';

export interface AiRequest {
  type: AiRequestType;
  message?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  business: Business;
  balanceSheetItems?: BalanceSheetItem[];
  addBacks?: EbitdaAddBack[];
  raiseAmount?: number;
  ddChecks?: DueDiligenceCheck[];
  cimFields?: {
    description: string;
    growth: string;
    moat: string;
    reason: string;
    ownerRole: string;
  };
  dscrData?: DSCRData;
  loanApplication?: LoanApplication;
}
