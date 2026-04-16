import type { Business, BalanceSheetItem, EbitdaAddBack, RedFlag, AfterTaxResult, DSCRData, DSCRResult } from './types';

// ─── SBA-Specific Calculations ───────────────────────────────────────────────

export function calculateDSCR(data: DSCRData): DSCRResult {
  const totalDebtService = data.proposedDebtService + data.existingDebtService;

  // SDE (Seller's Discretionary Earnings)
  const sde = data.netOperatingIncome + data.ownerSalary + data.ownerPerks + data.depreciation + data.nonRecurring;

  // Adjusted EBITDA (for DSCR calculation)
  const adjustedEbitda = data.netOperatingIncome + data.depreciation + data.nonRecurring;

  // After-tax net operating income (approximate)
  const afterTaxNOI = data.netOperatingIncome * (1 - data.taxRate / 100);

  // Global Cash Flow = After-tax NOI + owner add-backs - total debt service
  const globalCashFlow = afterTaxNOI + data.ownerSalary + data.ownerPerks + data.depreciation + data.nonRecurring;

  // DSCR = Global Cash Flow / Total Annual Debt Service
  const dscr = totalDebtService > 0 ? globalCashFlow / totalDebtService : 0;

  // SBA requires minimum 1.25x DSCR
  let dscrLabel: DSCRResult['dscrLabel'];
  let dscrColor: string;
  if (dscr >= 1.5) { dscrLabel = 'Strong'; dscrColor = 'var(--green)'; }
  else if (dscr >= 1.25) { dscrLabel = 'Acceptable'; dscrColor = 'var(--gold)'; }
  else if (dscr >= 1.0) { dscrLabel = 'Marginal'; dscrColor = '#f97316'; }
  else { dscrLabel = 'Below Threshold'; dscrColor = 'var(--red)'; }

  // Leverage ratio (Total Debt / EBITDA)
  const leverageRatio = adjustedEbitda > 0 ? data.totalLiabilities / adjustedEbitda : 0;

  // Working capital approximation (requires current assets/liabilities — use total assets as proxy)
  const workingCapital = data.totalAssets - data.totalLiabilities;

  const netMargin = data.annualRevenue > 0 ? (data.netOperatingIncome / data.annualRevenue) * 100 : 0;
  const debtToEquity = data.totalEquity > 0 ? data.totalLiabilities / data.totalEquity : 0;

  // SBA Health Score (0–100) for this borrower
  const sbaHealthScore = computeSBAHealthScore(dscr, netMargin, debtToEquity, leverageRatio);

  return { globalCashFlow, dscr, dscrLabel, dscrColor, sde, adjustedEbitda, leverageRatio, workingCapital, netMargin, debtToEquity, sbaHealthScore };
}

export function computeSBAHealthScore(
  dscr: number,
  netMarginPct: number,
  debtToEquity: number,
  leverageRatio: number
): number {
  let score = 50;

  // DSCR (most important for SBA)
  if (dscr >= 1.5) score += 20;
  else if (dscr >= 1.35) score += 12;
  else if (dscr >= 1.25) score += 5;
  else if (dscr >= 1.0) score -= 5;
  else score -= 20;

  // Net margin
  if (netMarginPct > 20) score += 15;
  else if (netMarginPct > 10) score += 8;
  else if (netMarginPct > 5) score += 3;
  else if (netMarginPct < 0) score -= 15;

  // D/E ratio
  if (debtToEquity < 1) score += 10;
  else if (debtToEquity < 2) score += 5;
  else if (debtToEquity > 4) score -= 10;

  // Leverage (debt/EBITDA)
  if (leverageRatio < 2) score += 5;
  else if (leverageRatio > 4) score -= 5;
  else if (leverageRatio > 6) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function computeValuationRangeForSBA(
  annualRevenue: number,
  ebit: number,
  industry: string
): { low: number; high: number; label: string; method: string } {
  const ind = (industry || '').toLowerCase();
  let revMultLow = 0.5, revMultHigh = 1.5, ebitMultLow = 2.5, ebitMultHigh = 4.5, label = 'General';

  if (ind.includes('saas') || ind.includes('software')) {
    revMultLow = 3; revMultHigh = 7; ebitMultLow = 8; ebitMultHigh = 15; label = 'SaaS/Software';
  } else if (ind.includes('tech')) {
    revMultLow = 2; revMultHigh = 5; ebitMultLow = 6; ebitMultHigh = 12; label = 'Technology';
  } else if (ind.includes('manufactur')) {
    revMultLow = 0.4; revMultHigh = 1.2; ebitMultLow = 3; ebitMultHigh = 5; label = 'Manufacturing';
  } else if (ind.includes('health') || ind.includes('medical')) {
    revMultLow = 0.8; revMultHigh = 2.5; ebitMultLow = 4; ebitMultHigh = 8; label = 'Healthcare';
  } else if (ind.includes('professional') || ind.includes('service')) {
    revMultLow = 0.5; revMultHigh = 1.2; ebitMultLow = 2.5; ebitMultHigh = 4; label = 'Professional Services';
  } else if (ind.includes('food') || ind.includes('restaurant')) {
    revMultLow = 0.3; revMultHigh = 0.7; ebitMultLow = 2; ebitMultHigh = 4; label = 'Food & Beverage';
  } else if (ind.includes('hvac') || ind.includes('home service') || ind.includes('plumb')) {
    revMultLow = 0.5; revMultHigh = 1.3; ebitMultLow = 3; ebitMultHigh = 5; label = 'Home Services';
  } else if (ind.includes('construct')) {
    revMultLow = 0.3; revMultHigh = 0.7; ebitMultLow = 2; ebitMultHigh = 3.5; label = 'Construction';
  } else if (ind.includes('retail')) {
    revMultLow = 0.3; revMultHigh = 0.7; ebitMultLow = 2; ebitMultHigh = 3.5; label = 'Retail';
  }

  // Blend revenue and EBITDA methods
  const revLow = annualRevenue * revMultLow;
  const revHigh = annualRevenue * revMultHigh;
  const ebitLow = ebit * ebitMultLow;
  const ebitHigh = ebit * ebitMultHigh;

  return {
    low: Math.min(revLow, ebitLow),
    high: Math.max(revHigh, ebitHigh),
    label,
    method: 'Revenue & EBITDA blended',
  };
}

// ─── Legacy / Borrower-Side Calculations ─────────────────────────────────────

export function calculateHealthScore(
  b: Business,
  assets: number,
  liabilities: number,
  equity: number
): number {
  let score = 50;
  if (equity > 0) score += 10;
  if (equity > assets * 0.5) score += 10;
  const de = liabilities > 0 && equity > 0 ? liabilities / equity : 0;
  if (de < 1) score += 10;
  else if (de < 2) score += 5;
  else if (de > 4) score -= 10;
  const margin = b.annual_revenue > 0 ? b.net_income / b.annual_revenue : 0;
  if (margin > 0.2) score += 15;
  else if (margin > 0.1) score += 8;
  else if (margin > 0.05) score += 3;
  else if (margin < 0) score -= 15;
  if (b.annual_revenue > 5_000_000) score += 5;
  return Math.max(0, Math.min(100, score));
}

export function computeDealReadinessScore(b: Business): number {
  const fields = [
    b.readiness_clean_books,
    b.readiness_revenue_quality,
    b.readiness_owner_independent,
    b.readiness_no_concentration,
    b.readiness_growing,
  ];
  return fields.reduce((sum, v) => {
    if (v === 3) return sum + 20;
    if (v === 2) return sum + 10;
    return sum;
  }, 0);
}

export function computeValuationRange(b: Business): { low: number; high: number; label: string } {
  const industry = (b.industry || '').toLowerCase();
  let multipleLow = 0.5, multipleHigh = 2.0, label = 'General';

  if (industry.includes('saas') || industry.includes('software')) { multipleLow = 4; multipleHigh = 8; label = 'SaaS/Software'; }
  else if (industry.includes('tech')) { multipleLow = 3; multipleHigh = 6; label = 'Technology'; }
  else if (industry.includes('manufactur')) { multipleLow = 0.5; multipleHigh = 1.5; label = 'Manufacturing'; }
  else if (industry.includes('health') || industry.includes('medical')) { multipleLow = 1; multipleHigh = 3; label = 'Healthcare'; }
  else if (industry.includes('professional') || industry.includes('service')) { multipleLow = 0.5; multipleHigh = 1.5; label = 'Professional Services'; }
  else if (industry.includes('food') || industry.includes('beverage') || industry.includes('restaurant')) { multipleLow = 0.3; multipleHigh = 0.8; label = 'Food & Beverage'; }
  else if (industry.includes('hvac') || industry.includes('home service') || industry.includes('plumb') || industry.includes('electr')) { multipleLow = 0.5; multipleHigh = 1.5; label = 'Home Services'; }
  else if (industry.includes('construct')) { multipleLow = 0.3; multipleHigh = 0.8; label = 'Construction'; }
  else if (industry.includes('retail') && industry.includes('franchise')) { multipleLow = 0.5; multipleHigh = 1.2; label = 'Retail Franchise'; }
  else if (industry.includes('retail')) { multipleLow = 0.3; multipleHigh = 0.8; label = 'Retail'; }
  else if (industry.includes('consumer') || industry.includes('product')) { multipleLow = 0.5; multipleHigh = 2.0; label = 'Consumer Products'; }
  else if (industry.includes('aviation') || industry.includes('aerospace')) { multipleLow = 0.5; multipleHigh = 1.5; label = 'Aviation/Aerospace'; }

  return { low: b.annual_revenue * multipleLow, high: b.annual_revenue * multipleHigh, label };
}

export function computeAdjustedEbitda(ebit: number, addBacks: EbitdaAddBack[]): number {
  return ebit + addBacks.reduce((sum, a) => sum + a.amount, 0);
}

export function computeSDE(ebit: number, ownerSalary: number, ownerPerks: number, depreciation: number, nonRecurring: number): number {
  return ebit + ownerSalary + ownerPerks + depreciation + nonRecurring;
}

export function detectRedFlags(b: Business, liabilities: number, equity: number): RedFlag[] {
  const flags: RedFlag[] = [];

  if (b.net_income < 0) flags.push({ severity: 'critical', title: 'Negative Net Income', detail: `Business is losing ${formatCurrency(Math.abs(b.net_income))} per year.`, action: 'Reduce expenses or increase revenue before pursuing exit.' });

  const margin = b.annual_revenue > 0 ? b.net_income / b.annual_revenue : 0;
  if (margin > 0 && margin < 0.05) flags.push({ severity: 'warning', title: 'Thin Net Margins', detail: `Net margin of ${(margin * 100).toFixed(1)}% is below healthy levels.`, action: 'Identify and cut low-value costs to improve profitability.' });

  if (equity < 0) flags.push({ severity: 'critical', title: 'Negative Equity', detail: 'Liabilities exceed assets — technically insolvent on paper.', action: 'Pay down debt or inject capital to restore positive equity.' });

  const de = equity > 0 ? liabilities / equity : 999;
  if (de > 3) flags.push({ severity: 'warning', title: 'High Leverage', detail: `Debt-to-equity ratio of ${de.toFixed(1)}x is elevated.`, action: 'Reduce debt load before going to market.' });

  if (b.readiness_owner_independent < 2) flags.push({ severity: 'warning', title: 'Owner Dependency', detail: 'Business appears heavily dependent on the owner.', action: 'Document processes and build management depth.' });

  if (b.readiness_no_concentration < 2) flags.push({ severity: 'watch', title: 'Customer/Revenue Concentration', detail: 'May have significant revenue concentration risk.', action: 'Diversify customer base — no single customer >20% of revenue.' });

  if (b.readiness_clean_books < 2) flags.push({ severity: 'watch', title: 'Financial Records Quality', detail: 'Financial records may not be audit-ready.', action: 'Get 3 years of CPA-prepared or audited financials.' });

  const revenuePerEmployee = b.employees > 0 ? b.annual_revenue / b.employees : 0;
  if (b.employees > 0 && revenuePerEmployee < 50000) flags.push({ severity: 'watch', title: 'Low Revenue per Employee', detail: `${formatCurrency(revenuePerEmployee)} per employee is below typical benchmarks.`, action: 'Evaluate productivity and staffing efficiency.' });

  return flags;
}

export function calculateAfterTaxProceeds(salePrice: number, costBasis: number, stateTaxRate: number, isAssetSale: boolean, ordinaryIncomeAmount: number): AfterTaxResult {
  const gain = salePrice - costBasis;
  const capitalGain = Math.max(0, gain - ordinaryIncomeAmount);
  const federalLTCG = capitalGain * 0.20;
  const federalOrdinary = ordinaryIncomeAmount * 0.37;
  const federalTax = federalLTCG + federalOrdinary;
  const niit = (capitalGain + ordinaryIncomeAmount) * 0.038;
  const stateTax = gain * (stateTaxRate / 100);
  const totalTax = federalTax + niit + stateTax;
  const netProceeds = salePrice - totalTax;
  const effectiveRate = salePrice > 0 ? totalTax / salePrice : 0;
  return { grossSalePrice: salePrice, federalTax, stateTax, netInvestmentIncomeTax: niit, totalTax, netProceeds, effectiveRate };
}

export function modelScenario(b: Business, revenueChangePct: number, marginChangePct: number): { projectedRevenue: number; projectedIncome: number; valuationLow: number; valuationHigh: number } {
  const projectedRevenue = b.annual_revenue * (1 + revenueChangePct / 100);
  const currentMargin = b.annual_revenue > 0 ? b.net_income / b.annual_revenue : 0;
  const newMargin = currentMargin + marginChangePct / 100;
  const projectedIncome = projectedRevenue * newMargin;
  const tempBusiness = { ...b, annual_revenue: projectedRevenue, net_income: projectedIncome };
  const range = computeValuationRange(tempBusiness);
  return { projectedRevenue, projectedIncome, valuationLow: range.low, valuationHigh: range.high };
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function getHealthLabel(score: number): string {
  if (score >= 70) return 'Strong';
  if (score >= 45) return 'Moderate';
  return 'Needs Work';
}

export function getHealthInsight(score: number, b: Business, equity: number): string {
  const label = getHealthLabel(score);
  const margin = b.annual_revenue > 0 ? ((b.net_income / b.annual_revenue) * 100).toFixed(1) : '0.0';
  if (score >= 70) return `This borrower shows ${label.toLowerCase()} financial health with a ${margin}% net margin and positive equity. Well-positioned for SBA loan approval.`;
  if (score >= 45) return `This borrower shows ${label.toLowerCase()} financial health with a ${margin}% net margin. Review DSCR carefully before proceeding.`;
  return `This borrower's financial profile requires additional scrutiny. A ${margin}% net margin and equity position of ${formatCurrency(equity)} indicate elevated risk.`;
}
