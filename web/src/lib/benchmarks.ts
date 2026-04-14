export interface IndustryBenchmark {
  industry: string;
  keywords: string[];
  netMarginMedian: number;
  netMarginTop25: number;
  revenueMultipleLow: number;
  revenueMultipleMedian: number;
  revenueMultipleHigh: number;
  ebitdaMultipleLow: number;
  ebitdaMultipleMedian: number;
  ebitdaMultipleHigh: number;
  avgDealSize: string;
  keyValueDrivers: string[];
  commonRisks: string[];
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    industry: 'SaaS / Software',
    keywords: ['saas', 'software', 'cloud', 'subscription'],
    netMarginMedian: 0.15,
    netMarginTop25: 0.28,
    revenueMultipleLow: 4,
    revenueMultipleMedian: 6,
    revenueMultipleHigh: 10,
    ebitdaMultipleLow: 10,
    ebitdaMultipleMedian: 15,
    ebitdaMultipleHigh: 25,
    avgDealSize: '$5M – $50M',
    keyValueDrivers: ['ARR growth rate', 'Net Revenue Retention', 'CAC payback period', 'Gross margin'],
    commonRisks: ['Customer churn', 'Technology obsolescence', 'Competitive displacement'],
  },
  {
    industry: 'Technology',
    keywords: ['tech', 'technology', 'it', 'digital'],
    netMarginMedian: 0.12,
    netMarginTop25: 0.22,
    revenueMultipleLow: 3,
    revenueMultipleMedian: 5,
    revenueMultipleHigh: 8,
    ebitdaMultipleLow: 8,
    ebitdaMultipleMedian: 12,
    ebitdaMultipleHigh: 20,
    avgDealSize: '$3M – $30M',
    keyValueDrivers: ['Recurring revenue %', 'Customer concentration', 'IP ownership', 'Team depth'],
    commonRisks: ['Key person dependency', 'Rapid market change', 'Margin compression'],
  },
  {
    industry: 'Manufacturing',
    keywords: ['manufactur', 'fabricat', 'production', 'assembly'],
    netMarginMedian: 0.07,
    netMarginTop25: 0.13,
    revenueMultipleLow: 0.5,
    revenueMultipleMedian: 0.9,
    revenueMultipleHigh: 1.5,
    ebitdaMultipleLow: 4,
    ebitdaMultipleMedian: 5.5,
    ebitdaMultipleHigh: 7,
    avgDealSize: '$2M – $20M',
    keyValueDrivers: ['Equipment quality', 'Customer diversification', 'Proprietary processes', 'Backlog'],
    commonRisks: ['Supply chain disruption', 'Equipment obsolescence', 'Labor availability'],
  },
  {
    industry: 'Healthcare / Medical',
    keywords: ['health', 'medical', 'dental', 'clinic', 'therapy', 'pharma'],
    netMarginMedian: 0.10,
    netMarginTop25: 0.18,
    revenueMultipleLow: 1.0,
    revenueMultipleMedian: 2.0,
    revenueMultipleHigh: 3.5,
    ebitdaMultipleLow: 5,
    ebitdaMultipleMedian: 7,
    ebitdaMultipleHigh: 10,
    avgDealSize: '$1M – $15M',
    keyValueDrivers: ['Payer mix', 'Provider credentials/retention', 'Recurring patient base', 'Compliance history'],
    commonRisks: ['Regulatory changes', 'Reimbursement rate risk', 'Physician departure'],
  },
  {
    industry: 'Professional Services',
    keywords: ['professional', 'consulting', 'accounting', 'legal', 'engineering', 'staffing'],
    netMarginMedian: 0.12,
    netMarginTop25: 0.20,
    revenueMultipleLow: 0.5,
    revenueMultipleMedian: 1.0,
    revenueMultipleHigh: 1.8,
    ebitdaMultipleLow: 3,
    ebitdaMultipleMedian: 5,
    ebitdaMultipleHigh: 7,
    avgDealSize: '$500K – $10M',
    keyValueDrivers: ['Client retention rate', 'Billable utilization', 'Recurring retainer %', 'Staff tenure'],
    commonRisks: ['Key person risk', 'Client concentration', 'Project-based revenue volatility'],
  },
  {
    industry: 'Food & Beverage',
    keywords: ['food', 'beverage', 'restaurant', 'bakery', 'catering', 'bar'],
    netMarginMedian: 0.05,
    netMarginTop25: 0.10,
    revenueMultipleLow: 0.3,
    revenueMultipleMedian: 0.5,
    revenueMultipleHigh: 0.9,
    ebitdaMultipleLow: 2.5,
    ebitdaMultipleMedian: 3.5,
    ebitdaMultipleHigh: 5,
    avgDealSize: '$200K – $3M',
    keyValueDrivers: ['Location quality', 'Brand strength', 'Supplier relationships', 'Staff stability'],
    commonRisks: ['Thin margins', 'Health code compliance', 'Food cost inflation', 'Labor turnover'],
  },
  {
    industry: 'HVAC / Home Services',
    keywords: ['hvac', 'home service', 'plumb', 'electr', 'roofing', 'pest control', 'landscap'],
    netMarginMedian: 0.10,
    netMarginTop25: 0.18,
    revenueMultipleLow: 0.5,
    revenueMultipleMedian: 1.0,
    revenueMultipleHigh: 1.8,
    ebitdaMultipleLow: 3.5,
    ebitdaMultipleMedian: 5,
    ebitdaMultipleHigh: 7,
    avgDealSize: '$500K – $8M',
    keyValueDrivers: ['Service contract / maintenance revenue', 'Technician team size', 'Fleet condition', 'Brand recognition'],
    commonRisks: ['Technician shortage', 'Seasonal volatility', 'Warranty liability'],
  },
  {
    industry: 'Construction',
    keywords: ['construct', 'contractor', 'builder', 'remodel', 'civil'],
    netMarginMedian: 0.05,
    netMarginTop25: 0.10,
    revenueMultipleLow: 0.2,
    revenueMultipleMedian: 0.4,
    revenueMultipleHigh: 0.8,
    ebitdaMultipleLow: 2.5,
    ebitdaMultipleMedian: 3.5,
    ebitdaMultipleHigh: 5,
    avgDealSize: '$500K – $5M',
    keyValueDrivers: ['Backlog visibility', 'Bonding capacity', 'Specialty licenses', 'Repeat customer base'],
    commonRisks: ['Project risk / overruns', 'Bonding requirements', 'Labor availability', 'Material cost volatility'],
  },
  {
    industry: 'Retail',
    keywords: ['retail', 'store', 'shop', 'ecommerce', 'e-commerce', 'consumer'],
    netMarginMedian: 0.04,
    netMarginTop25: 0.08,
    revenueMultipleLow: 0.2,
    revenueMultipleMedian: 0.5,
    revenueMultipleHigh: 0.9,
    ebitdaMultipleLow: 2,
    ebitdaMultipleMedian: 3.5,
    ebitdaMultipleHigh: 5,
    avgDealSize: '$200K – $3M',
    keyValueDrivers: ['Inventory turnover', 'Brand loyalty', 'Online presence', 'Lease terms'],
    commonRisks: ['E-commerce disruption', 'Inventory obsolescence', 'Lease exposure', 'Seasonality'],
  },
  {
    industry: 'Retail Franchising',
    keywords: ['franchise'],
    netMarginMedian: 0.08,
    netMarginTop25: 0.14,
    revenueMultipleLow: 0.4,
    revenueMultipleMedian: 0.8,
    revenueMultipleHigh: 1.3,
    ebitdaMultipleLow: 3,
    ebitdaMultipleMedian: 4.5,
    ebitdaMultipleHigh: 6,
    avgDealSize: '$500K – $5M',
    keyValueDrivers: ['Franchisee rating / score', 'Unit economics', 'Lease terms', 'Multi-unit potential'],
    commonRisks: ['Franchisor relationship', 'Royalty burden', 'Transfer approval', 'Brand health'],
  },
  {
    industry: 'Consumer Products',
    keywords: ['consumer product', 'cpg', 'brand', 'apparel', 'cosmetic', 'beauty'],
    netMarginMedian: 0.08,
    netMarginTop25: 0.16,
    revenueMultipleLow: 0.5,
    revenueMultipleMedian: 1.5,
    revenueMultipleHigh: 3,
    ebitdaMultipleLow: 4,
    ebitdaMultipleMedian: 6,
    ebitdaMultipleHigh: 10,
    avgDealSize: '$1M – $20M',
    keyValueDrivers: ['Brand equity', 'Gross margin', 'Retail distribution breadth', 'DTC revenue %'],
    commonRisks: ['Retail buyer concentration', 'Counterfeit risk', 'Trend sensitivity', 'Logistics costs'],
  },
  {
    industry: 'Aviation / Aerospace',
    keywords: ['aviation', 'aerospace', 'aircraft', 'flight', 'air'],
    netMarginMedian: 0.08,
    netMarginTop25: 0.15,
    revenueMultipleLow: 0.4,
    revenueMultipleMedian: 0.9,
    revenueMultipleHigh: 1.5,
    ebitdaMultipleLow: 4,
    ebitdaMultipleMedian: 6,
    ebitdaMultipleHigh: 9,
    avgDealSize: '$1M – $15M',
    keyValueDrivers: ['FAA certifications', 'Long-term contracts', 'Fleet condition', 'Regulatory compliance'],
    commonRisks: ['Regulatory changes', 'Fuel cost volatility', 'Maintenance liability', 'Insurance costs'],
  },
];

export interface ComparableTransaction {
  year: number;
  industry: string;
  revenueRange: string;
  multiple: string;
  dealStructure: string;
  note: string;
}

export const COMPARABLE_TRANSACTIONS: ComparableTransaction[] = [
  { year: 2023, industry: 'SaaS', revenueRange: '$2M–$5M ARR', multiple: '5–7× ARR', dealStructure: '70% cash, 30% earnout', note: 'Vertical SaaS with 90%+ NRR commanded premium' },
  { year: 2024, industry: 'HVAC Services', revenueRange: '$3M–$8M', multiple: '5–6× EBITDA', dealStructure: '80% cash, 20% rollover equity', note: 'Recurring maintenance contracts drove multiple above industry average' },
  { year: 2022, industry: 'Healthcare IT', revenueRange: '$1M–$3M ARR', multiple: '4–6× ARR', dealStructure: '100% cash at close', note: 'EHR integration capability attracted strategic acquirer' },
  { year: 2023, industry: 'Manufacturing', revenueRange: '$5M–$15M', multiple: '5–6× EBITDA', dealStructure: '75% cash, 25% seller note', note: 'Proprietary process and long-term OEM contracts supported valuation' },
  { year: 2024, industry: 'Professional Services', revenueRange: '$2M–$6M', multiple: '4–5× EBITDA', dealStructure: '60% cash, 40% earnout', note: 'Earnout tied to revenue retention of top 10 clients post-close' },
  { year: 2022, industry: 'E-commerce Brand', revenueRange: '$3M–$10M', multiple: '1.5–2.5× Revenue', dealStructure: '85% cash, 15% equity rollover', note: 'Strong DTC margins and owned email list attracted aggregator' },
  { year: 2023, industry: 'Dental Practice', revenueRange: '$1M–$3M', multiple: '6–8× EBITDA', dealStructure: '100% cash at close', note: 'DSO roll-up paid premium for clean Medicare/Medicaid payer mix' },
  { year: 2024, industry: 'Roofing / Home Services', revenueRange: '$4M–$10M', multiple: '5–7× EBITDA', dealStructure: '70% cash, 30% earnout', note: 'Strong recurring inspection revenue base justified higher multiple' },
  { year: 2022, industry: 'Food & Beverage', revenueRange: '$2M–$5M', multiple: '3–4× EBITDA', dealStructure: '100% cash at close', note: 'Regional brand with established retail distribution' },
  { year: 2023, industry: 'IT Managed Services', revenueRange: '$1M–$4M ARR', multiple: '6–8× EBITDA', dealStructure: '80% cash, 20% earnout', note: 'MSP with stable recurring revenue and low churn traded at premium' },
  { year: 2024, industry: 'Construction', revenueRange: '$5M–$15M', multiple: '3–4× EBITDA', dealStructure: '65% cash, 35% seller note', note: '18-month backlog and specialty bonding capacity drove deal' },
  { year: 2022, industry: 'Retail Franchise', revenueRange: '$1M–$3M', multiple: '3.5–5× EBITDA', dealStructure: '90% cash at close', note: 'Multi-unit operator with proven unit economics' },
  { year: 2023, industry: 'B2B SaaS', revenueRange: '$500K–$2M ARR', multiple: '3–5× ARR', dealStructure: '80% cash, 20% rollover', note: 'Small ARR tempered multiple despite high growth; strategic fit premium' },
  { year: 2024, industry: 'Aerospace MRO', revenueRange: '$3M–$8M', multiple: '5–7× EBITDA', dealStructure: '75% cash, 25% earnout', note: 'FAA repair station certification and DOD contracts drove valuation' },
  { year: 2023, industry: 'Consumer Products', revenueRange: '$4M–$12M', multiple: '1.5–3× Revenue', dealStructure: '70% cash, 30% equity rollover', note: 'Gross margins >60% and Shopify DTC traction attracted strategic buyer' },
];

export function getIndustryBenchmark(industry: string): IndustryBenchmark | null {
  if (!industry) return null;
  const lower = industry.toLowerCase();
  return INDUSTRY_BENCHMARKS.find(b => b.keywords.some(k => lower.includes(k))) || null;
}

export function getMarginPercentile(netMargin: number, benchmark: IndustryBenchmark): number {
  if (netMargin >= benchmark.netMarginTop25) return 85;
  if (netMargin >= benchmark.netMarginMedian) return 60;
  if (netMargin >= benchmark.netMarginMedian * 0.5) return 35;
  return 15;
}
