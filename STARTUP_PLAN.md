# CapTable AI — Comprehensive Strategic Plan
> AI-powered financial intelligence infrastructure for SBA lenders

**Version:** 1.0  
**Date:** April 2026  
**Status:** Pre-seed / Fundraising  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem)
3. [The Evolution of the Idea](#3-the-evolution-of-the-idea)
4. [The Final Strategy](#4-the-final-strategy)
5. [Market Analysis](#5-market-analysis)
6. [Product](#6-product)
7. [Go-To-Market Plan](#7-go-to-market-plan)
8. [Unit Economics](#8-unit-economics)
9. [Competitive Landscape & Moat](#9-competitive-landscape--moat)
10. [Regulatory Framework](#10-regulatory-framework)
11. [Team Requirements](#11-team-requirements)
12. [Funding Plan](#12-funding-plan)
13. [Risk Register](#13-risk-register)
14. [18-Month Execution Roadmap](#14-18-month-execution-roadmap)
15. [Open Questions](#15-open-questions)

---

## 1. Executive Summary

**What we are:**  
CapTable AI is an AI-powered financial analysis platform that automates the business valuation, document generation, and financial narrative work required in SBA 7(a) loan underwriting.

**Who we sell to:**  
SBA Preferred Lender Programs (PLPs) — the 140 highest-volume SBA lenders in the United States, designated by the SBA for their underwriting sophistication and loan volume.

**The problem we solve:**  
SBA loan officers manually analyze business financials, write valuation narratives, generate due diligence reports, and produce CIMs using spreadsheets and Word documents. This process takes 4–8 hours per application. CapTable AI reduces it to under 30 minutes.

**The business model:**  
B2B SaaS at $2,000–$5,000/month per institution, targeting $24K–$60K ACV.

**Why we win:**  
We are not competing with Abrigo or Baker Hill on loan origination software. We are a specialized AI layer for the financial analysis and narrative generation phase of underwriting — a gap incumbents have not filled and cannot fill quickly with their legacy architectures.

**Where we are:**  
Working product. Seeking $1.5M pre-seed to get SOC 2 Type II, close 10 PLP pilot contracts, and reach $300K ARR before raising a $3–5M seed.

---

## 2. The Problem

### 2.1 The SBA Loan Underwriting Workflow Is Broken

Every SBA 7(a) loan application requires a loan officer to:

- Spread the business's financial statements (income statement, balance sheet, cash flows)
- Calculate debt service coverage ratios, leverage ratios, and working capital adequacy
- Research and document industry-specific valuation multiples
- Write a business valuation narrative justifying the loan amount
- Assess the quality of the borrower's financial records
- Generate due diligence documentation
- Produce a credit memo summarizing the analysis

At a typical SBA PLP doing 200 loans per year, this represents **800–1,600 hours of manual analytical work annually** — the equivalent of one full-time analyst doing nothing but this task.

### 2.2 The Cost Is Measurable

| Metric | Estimate |
|--------|----------|
| Hours per SBA application (analysis + docs) | 4–8 hours |
| Fully loaded cost of an SBA analyst | $80,000–$120,000/year |
| Cost per application at 200 loans/year | $200–$600 per loan |
| Annual cost at a mid-size PLP (200 loans/year) | $40,000–$120,000 |

A $2,400/year SaaS tool that reduces this by 70% pays for itself on the first loan. This is not a vitamin. This is a calculator that already knows the answer.

### 2.3 Why Now

Three things changed in the last 24 months:

1. **LLMs can now generate coherent, accurate financial narratives.** This was not true in 2021. Claude 3 and GPT-4 can produce a business valuation narrative that a senior banker would find credible — and defensible. The quality crossed a threshold.

2. **AI API costs dropped 10x.** Generating a full credit memo analysis now costs $0.10–$0.50 in API fees. Building this product on 2021 infrastructure would have cost $5–$15 per report — structurally unviable.

3. **Community banks are under acute efficiency pressure.** Net interest margin compression from the 2022–2023 rate environment forced community banks and CDFIs to find cost reductions. Technology adoption that would have taken 5 years of sales cycle compressed to 18 months.

---

## 3. The Evolution of the Idea

Understanding how we arrived at this strategy matters for investor conversations and team alignment. This section documents the reasoning.

### 3.1 Original Idea: Direct-to-SMB SaaS

**The pitch:** AI-powered M&A and financial intelligence platform for small business owners preparing for exit.

**Why it fails:**
- CAC exceeds LTV at direct-to-SMB pricing ($100/month SaaS)
- Low-frequency use case (owners exit once) destroys retention
- Intuit/QuickBooks can ship this as a feature from a position of massive distribution advantage
- ChatGPT provides 60% of the value for free — chronic churn and low willingness to pay

### 3.2 Pivot Analysis: Five Options Evaluated

| Pivot | Model | Defensibility | Time to Revenue | Ceiling |
|-------|-------|--------------|-----------------|---------|
| Narrow ICP (FBA sellers) | SaaS | 4/10 | 2–3 months | $50M |
| Marketplace / referral fees | Transaction | 6/10 | 6–9 months | $300M |
| **SBA lender infrastructure** | **B2B SaaS** | **8/10** | **5–7 months** | **$300M+** |
| API for private company data | Infrastructure | 9/10 | 10–14 months | $1B+ |
| Succession planning for advisors | B2B SaaS | 7/10 | 3–4 months | $150M |

**Selected pivot: SBA Lender Infrastructure** — highest defensibility among options with venture-scale ceiling and achievable time to revenue.

### 3.3 Restructuring: What We Considered and Rejected

**Considered:** SBDC free tier → bank inbound → paid enterprise pipeline

**Rejected because:**
- SBDC channels are slow, nonprofit, and produce no direct revenue signal
- The assumption that bank loan officers ask borrowers what tool generated their documents is unvalidated and likely false
- Free tier creates $80K–$150K/year in cost drag with no conversion mechanism
- QuickBooks already has a formal SBDC partnership that would neutralize this wedge

**Considered:** CDFIs as compliance wedge before community banks

**Rejected because:**
- CDFI ACV ($6K–$12K/year) produces underwater unit economics given sales cycle costs
- Payback period of 20–30 months means you never reach Series A metrics on CDFI revenue alone

**Final decision:** Direct outreach to SBA Preferred Lender Programs. Harder upfront. Faster to real revenue and real metrics.

---

## 4. The Final Strategy

### 4.1 The One-Line Version

Sell AI-powered SBA underwriting analysis software directly to the 140 highest-volume SBA lenders in the country.

### 4.2 Why PLPs, Not Community Banks Generally

The 140 SBA Preferred Lenders are uniquely positioned targets:

| Characteristic | Community Banks (General) | SBA PLPs |
|---------------|--------------------------|---------|
| SBA loan volume | 1–20 loans/year | 50–500+ loans/year |
| SBA designation | Standard | Preferred (SBA-vetted) |
| Tech adoption speed | 12–24 month cycles | 6–12 month cycles |
| ROI of our product | Marginal | Immediate and measurable |
| Number of targets | 2,600 | 140 |
| Salesability | Hard to prioritize | Finite, named list |

With 140 PLPs you can name every target account, research every SBA lending director, and build a fully personalized outbound motion. This is not a volume sales problem. It is a precision sales problem.

### 4.3 The Positioning

**We are not:** A loan origination system. A credit decisioning tool. A replacement for Abrigo or Baker Hill.

**We are:** The AI analyst that sits between raw financial documents and the credit memo — automating the 4–8 hours of analysis and narrative work that happens before the loan officer makes a decision.

This positioning is deliberate:
- It keeps us out of the credit decision chain (CFPB regulatory risk reduction)
- It makes us complementary to existing LOS software, not competitive
- It makes the ROI calculation simple: cost of analyst time vs. cost of our software

---

## 5. Market Analysis

### 5.1 The SBA Lending Market

| Metric | Data |
|--------|------|
| SBA 7(a) loans approved (FY2023) | 57,362 loans |
| Total SBA 7(a) loan volume (FY2023) | $27.5 billion |
| Active SBA 7(a) lenders | ~2,600 |
| SBA Preferred Lender Programs (PLPs) | ~140 |
| PLP share of total SBA loan volume | ~65% |
| Average SBA loan size | ~$479,000 |

### 5.2 Bottoms-Up Market Sizing

**Tier 1 — SBA PLPs (primary target):**
- 140 PLPs × $3,000/month average ACV = $5M ARR at full penetration
- Realistic capture in 3 years: 40–60 PLPs = $1.4M–$2.2M ARR from this tier alone

**Tier 2 — Active SBA lenders (secondary expansion):**
- 500 mid-volume lenders (50–200 loans/year) × $1,500/month = $9M ARR
- Realistic 3-year capture: 100 lenders = $1.8M ARR

**Tier 3 — All active SBA lenders:**
- 2,600 total lenders × $750/month = $23.4M ARR at full penetration
- Realistic 5-year capture: 400 lenders = $3.6M ARR

**Combined realistic ARR at year 3:** $5M–$8M ARR  
**Combined realistic ARR at year 5:** $15M–$25M ARR

### 5.3 Expansion Revenue Paths

Beyond SBA underwriting, the same infrastructure applies to:
- USDA Business and Industry (B&I) loans (similar underwriting process)
- SBA 504 loans
- Conventional commercial loans at community banks
- Business acquisition lending (acquisition financing analysis)

Each expansion multiplies the addressable market 2–4x without changing the core product substantially.

---

## 6. Product

### 6.1 Core Features (Current)

| Feature | Description | Status |
|---------|-------------|--------|
| Business Valuation Engine | Industry-specific revenue/EBITDA multiples, DCF, comparable transactions | Built |
| Financial Health Scoring | Composite health score with red flag detection | Built |
| AI Financial Narrative | Claude-powered valuation and analysis narratives | Built |
| Balance Sheet Analysis | Asset/liability spreading, ratio calculations | Built |
| Due Diligence Checklist | 12-category DD readiness assessment | Built |
| CIM Generator | AI-generated Confidential Information Memorandum | Built |
| Buyer View Report | PE analyst-style deal memo | Built |
| Cap Table Management | Shareholder ownership and dilution modeling | Built |

### 6.2 Product Gaps for the PLP Market

| Required Feature | Priority | Estimated Build Time |
|-----------------|----------|---------------------|
| SBA-specific ratio templates (DSCR, global cash flow) | P0 | 3–4 weeks |
| Financial statement spreading (from uploaded docs) | P0 | 6–8 weeks |
| Credit memo template generation | P0 | 2–3 weeks |
| LOS integration (Baker Hill, nCino) | P1 | 3–4 months per LOS |
| Audit trail and reviewer notes | P1 | 2–3 weeks |
| SOC 2 compliance infrastructure | P0 | 4–6 months |
| Role-based access controls | P0 | 2–3 weeks |
| White-label / bank branding | P2 | 2–3 weeks |

### 6.3 The Reframing Required

The current product is built for the borrower (SMB owner self-service). The PLP product must be rebuilt for the lender (loan officer workflow). This is not a full rebuild — it is a UI/UX and data flow reorientation. Same valuation engine. Different user. Different presentation layer.

**Borrower product:** "Here is what your business is worth and how to improve it."  
**Lender product:** "Here is a structured analysis of this borrower's business for your credit file."

The underlying calculations are identical. The framing, access controls, output format, and workflow integration are different.

---

## 7. Go-To-Market Plan

### 7.1 ICP Definition

**Primary ICP:**
- SBA Preferred Lender Program designation
- 50–500 SBA 7(a) loans per year
- Community bank or CDFI (not mega-bank — they build internally)
- Has a dedicated SBA lending team (2+ loan officers focused on SBA)
- Located in top 50 metros by SBA loan volume

**Champion persona:**
- VP of SBA Lending or Director of Commercial Lending
- Pain: drowning in manual analysis, slow deal processing, analyst turnover
- Budget authority: $25K–$75K/year for lending technology
- Decision timeline: 3–6 months with board approval

**Blocker persona:**
- CTO / IT Security Officer
- Concern: vendor risk, data security, SOC 2, regulatory exposure
- Must-haves before they approve: SOC 2 Type II, penetration test, vendor risk questionnaire response

### 7.2 Sales Motion

**Phase 1 (Months 0–3): Outbound + Conference**

The 140 PLPs are a named list. Every one can be researched.

1. Build the target list: SBA website publishes PLP lenders by state. Cross-reference with FDIC call reports for asset size and SBA volume.
2. Identify the champion at each institution (LinkedIn, ICBA directory, state banking associations).
3. Cold outreach sequence: personalized email referencing their specific SBA loan volume and the cost of their current manual process.
4. Conference presence: ICBA Capital Summit, ABA Annual Convention, state SBA lender conferences.

**Outreach positioning:**
> "Your team processed X SBA applications last year. At 4–6 hours of analyst time each, that's Y hours of manual work. We automate 70% of it. I can show you a demo on Tuesday."

This is a concrete ROI statement, not a product pitch. Loan officers respond to time math.

**Phase 2 (Months 3–6): Pilot Conversion**

Target 5 pilot customers at $500–$1,000/month (discounted for SOC 2 in progress).

Pilot structure:
- 90-day pilot with 10 live SBA applications processed through the platform
- Weekly check-ins with champion
- Time tracking: log analyst hours before and after
- Outcome report: hours saved, quality of output vs. manual process
- Pilot converts to annual contract at full ACV upon SOC 2 completion

### 7.3 Customer #1000

Customer #1000 is not a PLP. It is a community bank doing 20–50 SBA loans per year, reached through:
- Referrals from PLP customers to their peer network (bankers talk to bankers)
- State banking association endorsements (achieved after PLP references)
- SBA district office relationships (SBA district offices work with all lenders in their region)
- Inbound from content marketing targeting "SBA underwriting best practices" search terms

The transition from 140 PLP targets to the broader 2,600-lender market happens at $2M+ ARR when you have distribution infrastructure in place.

---

## 8. Unit Economics

### 8.1 The Model

| Metric | Conservative | Base Case | Optimistic |
|--------|-------------|-----------|------------|
| ACV (PLP tier) | $24,000 | $36,000 | $60,000 |
| ACV (community bank tier) | $12,000 | $18,000 | $24,000 |
| Blended ACV | $18,000 | $27,000 | $42,000 |
| Sales cycle | 9 months | 6 months | 4 months |
| Annual churn | 10% | 7% | 5% |
| Gross margin | 68% | 74% | 80% |

### 8.2 CAC Breakdown

| Cost Component | Annual | Per Deal (10 deals/rep/year) |
|----------------|--------|------------------------------|
| Sales rep (fully loaded) | $200,000 | $20,000 |
| SE / implementation | $80,000 | $8,000 |
| Legal / security reviews | $30,000 | $3,000 |
| Conference / travel | $40,000 | $4,000 |
| **Total blended CAC** | | **$35,000** |

### 8.3 LTV/CAC

**Base case at $36K ACV, 7% churn:**
- LTV = $36,000 / 0.07 = **$514,000**
- LTV/CAC = $514K / $35K = **14.7x**
- Payback period = $35K / ($36K × 0.74 GM) = **16 months**

16-month payback is at the edge of acceptable for enterprise SaaS. The path to improving it: increase ACV (add seats per institution as they process more loans) and reduce CAC (inbound referrals from existing customers).

### 8.4 Hidden Cost Structures

**Compliance overhead (real and underestimated):**
- SOC 2 Type II: $75,000 initial + $25,000/year ongoing audits
- Penetration testing: $20,000/year
- Vendor risk questionnaire responses: 0.5 FTE equivalent
- Legal review of customer contracts: $5,000–$15,000 per enterprise deal

**AI infrastructure (variable cost risk):**
- Current Anthropic API cost per full analysis: ~$0.25–$0.75
- At 100 customers × 200 loans/year × $0.50/report = $10,000/year
- Manageable today, but Anthropic pricing is not guaranteed
- Mitigation: multi-model capability (OpenAI fallback), local model option for sensitive data

**Integration engineering:**
- Each LOS integration: $30,000–$80,000 in engineering time
- 5 LOS platforms to cover 80% of market: $150,000–$400,000 total
- This is a one-time cost but it is large and often underestimated

---

## 9. Competitive Landscape & Moat

### 9.1 The Competitive Map

| Competitor | What They Do | Why We're Different |
|-----------|-------------|-------------------|
| Abrigo (Sageworks) | Full LOS + credit analysis for community banks | Legacy architecture, no AI narrative generation, bundled product we're not replacing |
| Baker Hill | LOS for community banks | Same as Abrigo — complementary, not competitive |
| nCino | Bank operating system on Salesforce | Enterprise-only, no SBA-specific AI analysis layer |
| Numerated | Digital SBA lending platform | Front-end application processing, not underwriting analysis |
| Moody's Analytics | Risk analytics for large banks | Not serving community banks or PLPs |
| ChatGPT / Claude | General AI | No SBA-specific models, no workflow, no compliance posture |

**The key insight:** No incumbent is building an AI-native underwriting analysis layer for SBA lenders. Abrigo and Baker Hill are modernizing legacy systems. nCino is enterprise-only. The SBA PLP market has no adequate solution and the incumbents cannot ship a competitive product quickly because their architectures were built on rule-based spreading, not LLM-based narrative generation.

### 9.2 Building the Moat

**Moat Layer 1 — Data (months 0–18)**  
Every SBA application processed through our platform trains our understanding of what good SBA underwriting looks like by industry, loan size, and borrower type. Over 1,000+ applications, our industry benchmarks and valuation models become more accurate than anything available publicly. This data is not accessible to new entrants.

**Moat Layer 2 — Workflow Integration (months 6–24)**  
Deep integration with LOS platforms (Baker Hill, nCino) creates switching costs. Once a loan officer's workflow is built around our tool inside their LOS, ripping it out requires a workflow change, retraining, and a new vendor procurement cycle. Switching cost = ~$50,000–$100,000 in productivity loss and transition costs.

**Moat Layer 3 — Regulatory Posture (months 6–18)**  
SOC 2 Type II, penetration testing, and a track record of clean vendor risk assessments are expensive and time-consuming to build. A competitor starting today is 12–18 months behind on compliance alone. This is not a technology moat — it is a trust moat.

**Moat Layer 4 — Reference Network (months 12–36)**  
Bankers do not buy from vendors their peers haven't vetted. Once 20 PLPs are live and referenceable, the reference network becomes a distribution asset. A competitor would need to build their own reference network from scratch.

### 9.3 The Abrigo Specific Defense

Abrigo's threat is bundling. Their response to our traction will be:

- **Option A:** Acquire us ($15–30M exit, ~year 2–3)
- **Option B:** Ship an AI module to existing customers

For Option B to kill us, Abrigo needs to: (1) build LLM-native narrative generation (they are spreadsheet-native), (2) get it to production quality acceptable to regulated banks, (3) push it through their enterprise sales and implementation cycle to existing customers. Estimated timeline: 18–24 months minimum.

Our defense: get so embedded in PLP workflows with proprietary SBA-specific models that switching to Abrigo's generic module is not worth the disruption. The goal is not to out-feature Abrigo. The goal is to make switching costs exceed the cost of staying.

---

## 10. Regulatory Framework

### 10.1 The Positioning That Reduces Regulatory Risk

**We are a loan preparation tool, not a credit decisioning tool.**

This distinction matters legally:
- We do not recommend loan approval or denial
- We do not generate credit scores or credit risk assessments
- Our output is explicitly labeled as "analytical support for loan officer review"
- The loan officer makes all credit decisions using their own judgment

This positioning keeps us outside the primary regulatory frameworks that would apply to AI in credit decisions (ECOA, FCRA, fair lending requirements).

### 10.2 Regulatory Risk Matrix

| Risk | Probability (3yr) | Impact | Mitigation |
|------|------------------|--------|------------|
| CFPB guidance on AI in lending | 35% | High | Position as analysis tool, not decision tool; add explainability features |
| OCC vendor risk requirements | 95% (already exists) | Medium | SOC 2 Type II, pen test, vendor risk documentation — required before sale |
| SBA program rule changes to valuation requirements | 20% | Medium | Modular valuation engine, configurable to new SBA guidelines |
| State licensing for business valuation | 15% | Medium | Disclaimers, terms of service, legal review per state |
| SBA OIG investigation (loan fraud chain) | 10% | Very High | Clear disclaimers, no output submitted directly to SBA without loan officer review |
| Data breach / customer PII exposure | 20% | Very High | SOC 2, encryption at rest/transit, minimal PII storage |

### 10.3 Compliance Roadmap

| Milestone | Timeline | Cost | Why It Matters |
|-----------|----------|------|----------------|
| SOC 2 Type I | Month 3 | $25,000 | Required for pilot conversations with banks |
| Penetration test | Month 3 | $20,000 | Required for vendor risk questionnaires |
| SOC 2 Type II | Month 9 | $50,000 | Required for full contract execution with banks |
| Legal review of output disclaimers | Month 1 | $5,000 | Loan fraud chain protection |
| Privacy policy + DPA templates | Month 1 | $5,000 | GDPR/CCPA baseline, required by larger banks |
| Cyber liability insurance | Month 2 | $8,000/year | Required by most bank vendor contracts |

**Compliance budget (year 1): ~$115,000**  
This is not optional. Budget it before you budget sales headcount.

---

## 11. Team Requirements

### 11.1 The Non-Negotiable Hires

**Co-founder / Head of Sales — Banking Background**  
This is the single most important hire. Without someone who has sold software to banks before and has an existing network of lending officers, your sales cycle triples. This person should be able to name 20 SBA lending directors by first name. They are not a VP Sales from a SaaS background. They are someone who spent 5–10 years at Abrigo, Baker Hill, or a community bank technology company.

_If you cannot find this person, consider not starting. The product is not the hard part._

**Full-stack Engineer (2nd engineer)**  
The current product is functional but needs significant work for the PLP market: financial statement spreading, credit memo generation, LOS integrations, role-based access, audit trails. One more senior engineer for 12 months.

**Compliance / Implementation Lead (Month 6)**  
Handles vendor risk questionnaires, SOC 2 process management, customer onboarding and implementation at banks, and ongoing customer success. This role is unique to selling to regulated institutions. Do not hire a generic customer success manager — hire someone who has worked in bank technology implementation.

### 11.2 Founding Team Gaps

Be honest about what the current team likely lacks:

| Skill | Gap Level | Resolution |
|-------|-----------|------------|
| Bank enterprise sales | Critical | Co-founder hire or advisor with deal involvement |
| Regulatory / compliance | Moderate | Fractional compliance officer + outside counsel |
| LOS integration engineering | Moderate | Senior engineer hire or contractor |
| SBA lending domain knowledge | Moderate | Advisory board from SBA lending community |

### 11.3 Advisory Board Targets

Build a 3–5 person advisory board before raising:
- 1 former SBA district director or SBA program officer
- 1 VP of Lending from a current or former PLP institution
- 1 community banking technology executive (former Abrigo, Baker Hill, or nCino)
- 1 fintech regulatory attorney

These advisors provide credibility in investor conversations, open doors to first customers, and give you early warning on regulatory changes. Structure as 0.1–0.25% equity each with 2-year vesting.

---

## 12. Funding Plan

### 12.1 Pre-Seed Round

**Target raise:** $1.5M  
**Use of funds:** 18 months of runway to reach the seed milestones below  
**Valuation:** $6–8M pre-money (3–5 customer pilots as traction)  

**Pre-seed budget allocation:**

| Category | Monthly | 18 Months |
|----------|---------|-----------|
| Salaries (3 FTE) | $45,000 | $810,000 |
| Compliance (SOC 2, legal, pen test) | — | $115,000 |
| Product infrastructure (hosting, APIs) | $3,000 | $54,000 |
| Sales (conferences, travel, outbound tools) | $8,000 | $144,000 |
| G&A (legal, accounting, insurance) | $5,000 | $90,000 |
| **Total** | | **$1,213,000** |
| **Buffer** | | **$287,000** |

### 12.2 Seed Round Milestones

Before raising a $3–5M seed, you need:

| Milestone | Target |
|-----------|--------|
| Paying customers | 8–12 PLP institutions |
| ARR | $300,000–$500,000 |
| Average ACV | $30,000+ |
| Net Revenue Retention | >110% (expansion seats/modules) |
| SOC 2 Type II | Complete |
| Customer references | 3+ willing to take calls from investors |
| Payback period | <18 months demonstrated |

### 12.3 Series A Milestones (For Planning Purposes)

| Milestone | Target |
|-----------|--------|
| ARR | $2M+ |
| Customers | 50+ institutions |
| NRR | >120% |
| LOS integration(s) | 2+ live integrations |
| Team | 12–15 people |
| Target raise | $8–15M |

---

## 13. Risk Register

### 13.1 Existential Risks

| Risk | Likelihood | Impact | Status |
|------|-----------|--------|--------|
| Abrigo bundles competitive feature | High (18–24 months) | Existential | Mitigate via deep workflow integration before Abrigo ships |
| CFPB reclassifies tool as credit decision AI | Medium | Existential | Positioning and disclaimers, monitor regulatory developments |
| Cannot hire banking sales co-founder | Medium | Existential | Active search before raising; advisor bridge if needed |
| SBA loan volume drops significantly | Low | High | Expand to conventional commercial lending as hedge |
| Federal loan fraud implication | Low | Existential | Legal review of outputs, clear human-review requirement in contracts |

### 13.2 Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SOC 2 delays by 3–6 months | Medium | High | Start immediately; do not wait for paying customers |
| LOS integration takes longer than estimated | High | Medium | Start with API-only, no native integration, for first 10 customers |
| Anthropic API pricing increase | Medium | Medium | Multi-model fallback; explore open-source models for non-sensitive analysis |
| Key engineer departure | Medium | High | Equity vesting, competitive comp, documentation standards |
| SBDC/CDFI distraction | Medium | Medium | Do not build free tier; maintain PLP-only focus in year 1 |

### 13.3 Market Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| TAM too small ($5–8M ARR PLP ceiling) | High (it is real) | High | Expansion to broader community bank market is the growth path; do not overstate TAM to investors |
| Bank procurement extends beyond 6 months | High | Medium | Extended runways, bridge financing, stagger pipeline |
| Incumbent partnership forecloses market | Medium | High | Move fast; sign 20+ customers before incumbents notice |

---

## 14. 18-Month Execution Roadmap

### Month 0–1: Foundation

- [ ] Reposition product for loan officer workflow (framing, output format, disclaimers)
- [ ] Build SBA-specific financial ratio templates (DSCR, global cash flow, working capital)
- [ ] Initiate SOC 2 Type I with a readiness firm
- [ ] Legal review of output disclaimers and terms of service
- [ ] Purchase cyber liability insurance
- [ ] Build the 140 PLP target list with champion contact names
- [ ] Activate advisory board recruitment (target: 2 advisors signed by month 2)

### Month 2–3: First Outreach

- [ ] Launch personalized cold outreach to 140 PLPs (email + LinkedIn)
- [ ] Attend first banking conference (ICBA or state SBA lender event)
- [ ] Complete SOC 2 Type I
- [ ] Complete penetration test
- [ ] Book 20+ discovery calls
- [ ] Run 5+ product demos with live SBA loan scenarios
- [ ] Close 2–3 pilot agreements at $500–$750/month

### Month 4–6: Pilot Execution

- [ ] Onboard pilots, process live SBA applications through the platform
- [ ] Track and document time savings per application
- [ ] Build credit memo template generator (biggest missing feature for lenders)
- [ ] Add role-based access controls and audit trail
- [ ] Begin SOC 2 Type II observation period (requires ~6 months)
- [ ] Close 2–3 additional pilots; target 5 paying customers by month 6

### Month 7–9: Convert and Grow

- [ ] Convert pilots to annual contracts at full ACV upon SOC 2 completion
- [ ] Develop case study with first reference customer
- [ ] Begin Baker Hill integration (most common LOS at PLPs)
- [ ] Hire compliance/implementation lead
- [ ] Target: 8 customers, $150K ARR, SOC 2 Type II in final review

### Month 10–12: Series Seed Preparation

- [ ] Complete SOC 2 Type II
- [ ] Close 10–12 customers; target $250K–$300K ARR
- [ ] Baker Hill integration in beta with 2 customers
- [ ] Begin seed fundraise conversations
- [ ] Hire second sales rep (banking background)

### Month 13–18: Scale

- [ ] Complete seed raise ($3–5M)
- [ ] Expand sales team to 3 reps
- [ ] Launch Baker Hill integration generally available
- [ ] Begin nCino integration
- [ ] Expand to USDA B&I loan use case (same product, different program)
- [ ] Target: 30+ customers, $700K ARR, NRR >115%

---

## 15. Open Questions

These are the questions that must be answered before raising and before the first hires. Do not paper over them with assumptions.

**On the customer:**
1. Will a loan officer actually use an AI-generated narrative in a credit file, or will they rewrite it anyway? (If they rewrite it, the time savings collapse.)
2. What is the actual average hours per SBA application at a PLP? (The 4–8 hour estimate is the critical variable in the ROI calculation — validate it.)
3. Does a PLP lending director have independent budget authority for $25–50K software, or does it require board approval?

**On the product:**
4. What does financial statement spreading look like in the current manual workflow — is this a feature we need before pilots or can we defer it?
5. Which LOS platform do our first 5 target customers use? (Build that integration first, not the most common one.)

**On the team:**
6. Is there a banking technology sales executive who would join as a co-founder for the right equity? Who specifically?
7. Can the advisory board be assembled before the pre-seed closes?

**On the market:**
8. Are there any SBA PLPs already using any AI tools for underwriting? (If yes, who? If not, why not?)
9. What does the SBA's own technology modernization agenda look like — is there any path to becoming an SBA-endorsed tool?

---

*This document is a living strategic plan. It should be reviewed and updated monthly during the pre-seed phase as customer conversations produce new information. The assumptions in the unit economics section in particular should be replaced with real data from the first 3 pilots.*

---

---

## 16. Financial Projections

### 16.1 Key Assumptions

| Assumption | Value | Basis |
|------------|-------|-------|
| Average ACV (PLP tier) | $36,000 | $3,000/month × 12 |
| Average ACV (community bank tier) | $18,000 | $1,500/month × 12 |
| Monthly churn (PLP) | 0.5% (~6%/year) | Enterprise SaaS benchmark |
| Gross margin | 74% | SaaS with AI API + compliance overhead |
| Sales cycle | 5 months average | PLPs move faster than general community banks |
| Ramp time per sales rep | 3 months | New rep quota attainment |
| Expansion revenue | 15% of ARR annually from seat/module expansion | Conservative NRR assumption |

### 16.2 Three-Year P&L Model

#### Year 1 (Pre-seed funded)

| Quarter | New Customers | Total Customers | ARR | Revenue (Qtr) |
|---------|--------------|-----------------|-----|---------------|
| Q1 | 1 | 1 | $36K | $9K |
| Q2 | 3 | 4 | $144K | $27K |
| Q3 | 4 | 8 | $288K | $63K |
| Q4 | 4 | 12 | $432K | $90K |
| **Year 1 Total** | **12** | **12** | **$432K** | **$189K** |

| Expense Category | Year 1 |
|-----------------|--------|
| Salaries & benefits (3 FTE avg) | $540,000 |
| Compliance (SOC 2, legal, pen test) | $115,000 |
| Infrastructure & APIs | $36,000 |
| Sales & marketing | $96,000 |
| G&A | $60,000 |
| **Total Burn** | **$847,000** |
| **Net Burn** | **($658,000)** |

#### Year 2 (Post-seed raise of $4M)

| Quarter | New Customers | Total Customers | ARR | Revenue (Qtr) |
|---------|--------------|-----------------|-----|---------------|
| Q1 | 6 | 18 | $648K | $135K |
| Q2 | 8 | 26 | $936K | $198K |
| Q3 | 9 | 35 | $1.26M | $270K |
| Q4 | 10 | 45 | $1.62M | $351K |
| **Year 2 Total** | **33** | **45** | **$1.62M** | **$954K** |

| Expense Category | Year 2 |
|-----------------|--------|
| Salaries & benefits (10 FTE avg) | $1,400,000 |
| Compliance & legal | $80,000 |
| Infrastructure & APIs | $72,000 |
| Sales & marketing | $280,000 |
| G&A | $120,000 |
| **Total Burn** | **$1,952,000** |
| **Net Burn** | **($998,000)** |

#### Year 3 (Scale)

| Quarter | New Customers | Total Customers | ARR | Revenue (Qtr) |
|---------|--------------|-----------------|-----|---------------|
| Q1 | 12 | 57 | $2.05M | $459K |
| Q2 | 14 | 71 | $2.56M | $567K |
| Q3 | 15 | 86 | $3.10M | $684K |
| Q4 | 16 | 102 | $3.67M | $810K |
| **Year 3 Total** | **57** | **102** | **$3.67M** | **$2.52M** |

| Expense Category | Year 3 |
|-----------------|--------|
| Salaries & benefits (22 FTE avg) | $3,080,000 |
| Compliance & legal | $100,000 |
| Infrastructure & APIs | $144,000 |
| Sales & marketing | $520,000 |
| G&A | $200,000 |
| **Total Burn** | **$4,044,000** |
| **Net operating income** | **($1,524,000)** |

*Year 3 cash flow turns positive in Q4 with $810K quarterly revenue against ~$1M quarterly burn.*

### 16.3 Path to Profitability

| Milestone | Timing | ARR Required |
|-----------|--------|-------------|
| Gross profit positive | Month 4 | Any paying customer (74% GM) |
| Operating cash flow breakeven | Month 38 | ~$4.5M ARR |
| Series B raise (optional) | Month 30–36 | $3M+ ARR |

---

## 17. Investor Pitch Framework

### 17.1 The Narrative Arc

A great pitch tells one story with no detours. Here is the arc:

**Opening (30 seconds):**
> "The SBA approved 57,000 loans last year worth $27 billion. Every single one required a loan officer to manually spread financials, write a valuation narrative, and produce a credit memo. That's 4–8 hours of analyst work per loan. We automate 70% of it."

**The Problem (60 seconds):**
SBA loan officers are analysts doing repetitive work at $80K+ salaries. Spreading a set of financial statements, calculating ratios, and writing the narrative takes half a business day. At a PLP doing 200 loans per year, that's one full-time analyst doing nothing else. This is not a technology problem — it is an efficiency problem that technology can solve, and it was not solvable before large language models were capable enough to write coherent financial analysis.

**The Solution (60 seconds):**
Upload a business's financial documents. In 30 minutes, get: a structured financial spread, debt service coverage ratios, an industry-benchmarked valuation range, and a draft credit memo narrative — all ready for loan officer review. Not a replacement for the loan officer. An analyst that works at 1/100th the cost.

**The Market (30 seconds):**
140 SBA Preferred Lenders, $5M ARR at full penetration. 2,600 total SBA lenders, $25M+ ARR. Adjacent: USDA B&I loans, conventional commercial lending, acquisition financing. Realistic 5-year ARR: $15–25M.

**Traction (60 seconds):**
[Insert real pilot data here: customers, time saved per application, NPS, ARR]

**Why we win (60 seconds):**
No incumbent has built this. Abrigo and Baker Hill are rule-based spreading tools built on 1990s architecture. They cannot ship LLM-native narrative generation quickly. We will be embedded in PLP workflows with proprietary SBA data models before they notice us.

**The Ask:**
$1.5M pre-seed to close 10 PLP customers and complete SOC 2 Type II. Return to raise $4M seed at $300K ARR.

### 17.2 The 10 Questions Every Investor Will Ask

Prepare tight, honest answers to each of these before every meeting:

| Question | The Honest Answer |
|----------|-------------------|
| Why won't Abrigo just copy this? | They will try. We have 18 months before they can ship. Our moat is depth of integration, not novelty. |
| How do you handle the regulatory risk around AI in lending? | We're a preparation tool, not a decision tool. We never touch the credit decision. Our output requires loan officer review before entering the credit file. |
| Your TAM seems small — 140 customers? | 140 PLPs is the wedge. 2,600 total SBA lenders is the market. USDA B&I and conventional commercial is the expansion. We don't need to overstate TAM — the unit economics make a $5M ARR business from PLPs alone highly valuable. |
| Do you have anyone who has sold to banks before? | [Honest answer required. If no: "We are actively recruiting a co-founder with that background and have three candidates in conversation."] |
| What happens if a loan defaults and your analysis was in the file? | Our contracts include explicit disclaimers that our output is analytical support, not a credit opinion. Loan officers are required to review and verify all outputs before use. We carry E&O insurance. |
| Why would a bank trust a 3-person startup with loan data? | SOC 2 Type II, penetration test, vendor risk documentation. We have [X] institutions already piloting. |
| What's the payback period? | 16 months at base case ACV. We save a PLP $40,000–$120,000/year in analyst time. We charge $36,000/year. It pays for itself in one quarter. |
| How do you handle financial statement spreading? | [This is a product gap — be honest: "We're building native spreading. Current pilots use pre-spread data. Spreading integration is on the Q2 roadmap."] |
| What does NRR look like? | We project 115%+ through seat expansion and module additions. Current cohort data: [insert real data]. |
| Why you? | [Founder-market fit answer: be specific about your connection to this problem and why you are the right team.] |

### 17.3 Deck Structure (12 Slides)

1. **Cover** — Company name, one-line description, contact
2. **The Problem** — Manual SBA underwriting workflow, cost in hours and dollars
3. **The Solution** — Product demo screenshot, before/after workflow
4. **Traction** — Paying customers, ARR, time-saved metrics, quotes
5. **Market** — Bottoms-up TAM: PLPs → all SBA lenders → commercial lending
6. **Product** — Feature overview, roadmap, LOS integration strategy
7. **Business Model** — ACV, LTV/CAC, payback period, gross margin
8. **Go-To-Market** — PLP direct motion, conference strategy, reference network flywheel
9. **Competition** — Landscape map, why incumbents can't move fast, our moat
10. **Team** — Founders, advisors, key hires planned
11. **Financials** — 3-year model, path to profitability, use of funds
12. **The Ask** — Amount, milestones, next raise trigger

---

## 18. Sales Playbook

### 18.1 Outbound Sequence

**Step 1 — Research (Day 0)**
Before any outreach, know:
- How many SBA loans they closed last year (SBA public data)
- Their LOS platform (LinkedIn research, job postings)
- The name of their SBA lending director or VP of Commercial Lending
- Any recent news (new markets, growth announcements, SBA awards)

**Step 2 — First Email (Day 1)**

Subject: `SBA loan analysis — [Bank Name]`

> Hi [Name],
>
> [Bank Name] closed [X] SBA loans last year — [number] more than most PLPs in [state].
>
> I'm guessing your team spends 4–6 hours on analysis and documentation per application. At that volume, that's [calculated hours] hours of analyst work annually — roughly one FTE doing nothing else.
>
> We built an AI tool that automates 70% of that work: financial spreading, DSCR calculation, valuation narrative, and credit memo draft — in under 30 minutes per application.
>
> Worth a 20-minute call to see if the math works for your team?
>
> [Name]

**Step 3 — LinkedIn Follow (Day 4)**
Connect with a short note referencing the email. Do not resend the email. Let the connection request do the work.

**Step 4 — Follow-up Email (Day 8)**

Subject: `Re: SBA loan analysis — [Bank Name]`

> Quick follow up — I put together a rough time-savings estimate for [Bank Name] based on your SBA volume. Happy to share it on a call, or just send it over if you'd prefer.

Attach: a one-page ROI estimate personalized with their specific loan volume.

**Step 5 — Phone Call (Day 12)**
If no response to emails, call the main lending department line. Ask for the SBA lending director by name.

**Step 6 — Break-up email (Day 20)**

> I'll stop following up after this — I know inboxes are brutal. If SBA underwriting efficiency ever becomes a priority, I'm at [email]. Happy to reconnect.

This email often generates a response. People respond to closure.

### 18.2 Discovery Call Framework

The discovery call has one goal: determine if there is a real problem worth solving at this institution. Do not pitch. Ask.

**Questions to ask:**
1. "Walk me through what happens when an SBA application comes in — what does the analyst workflow look like from application to credit memo?"
2. "How long does that process take on a typical loan?"
3. "What tools does your team currently use for financial spreading and analysis?"
4. "Where does most of the time go — the spreading, the ratio analysis, or the narrative writing?"
5. "Do you have capacity constraints right now — are deals waiting longer than they should because of analyst bandwidth?"
6. "If you could cut that process time by 60–70%, what would you do with the recovered hours?"

**Qualifying criteria (proceed to demo if yes to 3+):**
- [ ] Does 50+ SBA loans per year
- [ ] Manually spreads financials (no fully automated spreading tool)
- [ ] Analyst bandwidth is a real constraint
- [ ] Has budget authority or clear path to budget approval
- [ ] Is not mid-procurement with a competing solution

### 18.3 Demo Flow

**Total time: 30 minutes**

| Time | Content |
|------|---------|
| 0–3 min | Recap what you heard in discovery — show you listened |
| 3–8 min | Show the problem quantified: their specific loan volume × hours = cost |
| 8–20 min | Live demo with a real SBA loan scenario (use anonymized sample data) |
| 20–25 min | Show the output: financial spread, ratios, valuation narrative, credit memo draft |
| 25–30 min | Q&A and next steps |

**Demo must-haves:**
- Use realistic numbers, not toy data. Run it on a $1.5M HVAC business — that's what their borrowers look like.
- Show the before state (a messy Excel file and blank Word doc) before showing your product
- Let them see the credit memo output cold — don't narrate it, let them read it
- Have a pre-built "time savings calculator" showing their specific ROI

### 18.4 Common Objections and Responses

| Objection | Response |
|-----------|----------|
| "We already have a process that works." | "I'm not suggesting your process is broken — I'm suggesting it's expensive. At [X] loans/year, how many analyst hours are going into what we just showed?" |
| "Our IT team won't approve a new vendor." | "Understood. What does your vendor approval process look like? We have SOC 2 Type I and a full vendor risk package ready — I can send it today to make their review faster." |
| "We're not sure about AI in our loan files." | "Our output never goes in the file without a loan officer reviewing and approving it. It's an analyst tool, not a decision tool. The loan officer is always in the loop." |
| "We don't have budget right now." | "When does your budget cycle reset? And if I can show this saves [X] analyst hours worth $[Y] this year, is there a way to fund it from operational savings rather than new budget?" |
| "Abrigo is supposedly building something similar." | "They may be. But they're a rules-based spreading tool building on 30-year-old architecture. The AI narrative generation we showed you isn't something they can add quickly. In the meantime, you're leaving $[X] of analyst cost on the table every month." |

### 18.5 Pilot Structure

A well-designed pilot removes all risk for the customer and all ambiguity for you.

**Pilot terms:**
- Duration: 90 days
- Price: $500–$750/month (discounted from full ACV)
- Commitment: Process minimum 10 SBA applications through the platform
- Success metrics defined upfront (see below)
- Convertible to annual contract at full ACV upon SOC 2 Type II completion

**Success metrics (agree on these before the pilot starts):**

| Metric | Baseline | Target |
|--------|----------|--------|
| Time per application (analysis + docs) | [Measured in week 1] | 40% reduction |
| Loan officer satisfaction (1–10) | [Measured at start] | 7+ |
| Credit memo quality (loan officer rating) | [Measured at start] | "Good enough to use with minor edits" |
| Errors requiring correction | [Measured over pilot] | <2 per 10 applications |

**Pilot review meeting (Day 85):**
Run a formal review with the champion and their manager. Present the data against the agreed metrics. If metrics are hit, ask for the annual contract on the spot.

---

## 19. Product Roadmap

### 19.1 Priority Framework

Features are prioritized by a single question: **does this unblock a PLP sale or prevent churn?**

| Priority | Criteria |
|----------|----------|
| P0 | Blocks pilot sign or causes pilot churn |
| P1 | Required for annual contract conversion |
| P2 | Enables expansion revenue |
| P3 | Nice to have, does not affect revenue |

### 19.2 Roadmap by Quarter

#### Q1 (Foundation for First Pilots)

| Feature | Priority | Owner | Notes |
|---------|----------|-------|-------|
| SBA-specific ratio templates (DSCR, global cash flow, leverage) | P0 | Engineering | Required before any demo to a bank |
| Credit memo template generator | P0 | Engineering | Most-requested feature in discovery calls |
| Loan officer UI (not borrower UI) | P0 | Engineering | Current UI is for SMB owners; must reframe for bank workflow |
| Output disclaimer system | P0 | Engineering + Legal | "For loan officer review only" on all outputs |
| Role-based access (admin, loan officer, read-only) | P0 | Engineering | Required by bank IT |
| Audit trail (who accessed what, when) | P0 | Engineering | Required by bank IT and SOC 2 |

#### Q2 (Pilot Conversion Features)

| Feature | Priority | Owner | Notes |
|---------|----------|-------|-------|
| Financial statement spreading (PDF upload → structured data) | P0 | Engineering | Single biggest feature gap; enables true automation |
| Baker Hill integration (API-level) | P1 | Engineering | Most common LOS at PLPs |
| Time savings dashboard (shows hours saved per application) | P1 | Engineering | Critical for pilot review meeting and renewal conversation |
| Multi-borrower pipeline view | P1 | Engineering | Loan officers work across many applications simultaneously |
| Custom valuation model inputs | P1 | Engineering | Some PLPs have internal valuation frameworks they must follow |

#### Q3 (Expansion Revenue Features)

| Feature | Priority | Owner | Notes |
|---------|----------|-------|-------|
| USDA B&I loan templates | P1 | Engineering | Adjacent use case, same customers |
| nCino integration | P1 | Engineering | Second major LOS platform |
| Multi-user seat management + billing | P1 | Engineering | Required for expansion revenue; bill per seat |
| Industry benchmark database | P2 | Data | Proprietary data moat; pulls from processed applications |
| White-label branding | P2 | Engineering | Some banks want bank-branded outputs |

#### Q4 (Moat-Building Features)

| Feature | Priority | Owner | Notes |
|---------|----------|-------|-------|
| Proprietary SBA valuation model (trained on platform data) | P1 | ML/Engineering | Data moat; more accurate than public comparables |
| Automated comparable transaction sourcing | P2 | Engineering | Reduces manual research for loan officers |
| SBA SOP compliance checker | P2 | Engineering | Flags if application documentation meets SBA SOP 50 10 requirements |
| API for LOS vendor partnerships | P2 | Engineering | Enables co-sell motion with LOS vendors |

### 19.3 What We Are Not Building (Year 1)

Scope discipline is as important as the roadmap. Do not build:

- A loan origination system (we are not replacing Abrigo or Baker Hill)
- A borrower-facing portal (we are B2B; borrowers interact through their bank's existing channels)
- A credit scoring or risk rating model (regulatory risk, not our lane)
- A general-purpose business intelligence tool (focus kills us if we widen scope)
- Mobile app (loan officers work at desks)

---

## 20. KPIs & Operating Metrics

### 20.1 The Weekly Dashboard

Every Monday morning, the founding team reviews these numbers. Nothing else.

| Metric | Target (Month 6) | Target (Month 12) | Target (Month 18) |
|--------|-----------------|-------------------|-------------------|
| ARR | $100K | $300K | $600K |
| Paying customers | 3 | 8 | 15 |
| Pipeline (qualified) | 15 | 40 | 80 |
| Discovery calls booked | 5/week | 10/week | 15/week |
| Demo-to-pilot conversion | >30% | >35% | >40% |
| Pilot-to-annual conversion | — | >70% | >75% |
| Applications processed (platform-wide) | 50 | 300 | 1,000 |
| Avg time per application (customer-reported) | — | <2 hours | <90 min |
| NPS | — | >40 | >50 |
| Churn | 0 | 0 | <1 customer |

### 20.2 Leading vs. Lagging Indicators

**Leading (predict revenue 60–90 days out):**
- Discovery calls per week
- Demo conversion rate
- Pilot agreements signed
- Vendor risk questionnaires submitted
- Conference meetings booked

**Lagging (confirm what already happened):**
- ARR
- Customers
- Churn
- NRR

Obsess over leading indicators in months 0–12. The lagging metrics will follow.

### 20.3 Red Flags — When to Change Strategy

If any of the following are true at Month 9, reassess the strategy:

| Red Flag | What It Means |
|----------|---------------|
| Fewer than 3 paying customers | Sales motion or product-market fit problem |
| Discovery call to demo conversion <20% | Outreach message or ICP is wrong |
| Demo to pilot conversion <15% | Product is not demonstrating value or SOC 2 is blocking |
| Average pilot takes >4 months to close | Sales cycle is longer than model assumes; need banking co-founder |
| First churn event within 6 months of onboarding | Product not delivering promised time savings |
| Loan officers not using the product after onboarding | Change management problem; need implementation support |

---

## 21. Customer Success Framework

### 21.1 The Onboarding Playbook

Poor onboarding is the #1 cause of churn in B2B SaaS sold to banks. Banks are risk-averse — if the first 30 days are confusing, they stop using the product and do not renew.

**Week 1 — Setup**
- Admin account creation, user provisioning, SSO configuration
- Data import: historical financials for 2–3 sample applications
- Kick-off call with all loan officers who will use the platform
- Training session: 60-minute walkthrough with live demo on their own data

**Weeks 2–4 — Guided Usage**
- Loan officer processes first 3 live applications with CS support on standby
- Daily Slack channel for quick questions (or email if the bank prefers)
- End-of-week 2 check-in: what's working, what isn't, what needs adjustment

**Month 2 — Independent Usage**
- Loan officers process applications independently
- CS team monitors usage dashboard — flag any accounts with zero activity
- Mid-pilot review call: run the success metrics against baseline

**Month 3 — Renewal Setup**
- Formal pilot review meeting (see Sales Playbook §18.5)
- Present time savings data
- Propose annual contract with pricing

### 21.2 Expansion Revenue Triggers

Watch for these signals that indicate upsell/expansion opportunity:

| Signal | Expansion Opportunity |
|--------|----------------------|
| >5 loan officers using the platform | Add seats; current plan covers 3 |
| Customer starts processing USDA B&I loans | USDA module add-on |
| Customer asks about conventional commercial loan analysis | Commercial module |
| Customer references you to a peer bank | Referral program activation |
| Customer's loan volume increases significantly | Volume-based pricing tier |

Target NRR of 115% means the average customer grows their contract value by 15% annually. This comes from seats and modules, not price increases.

### 21.3 The Reference Program

References are your most valuable sales asset. Systematize them.

**Earning a reference (ask at 90-day mark if NPS >8):**
1. Ask for permission to use them as a reference for investor conversations
2. Ask for a written testimonial (specific: hours saved, applications processed)
3. Ask if they would take a 15-minute call from a prospective customer

**The reference network flywheel:**
Bankers talk to bankers. Every happy customer is a distribution channel. Create a structured way for them to refer peers:
- Referral program: give referring customer 2 months free for every closed referral
- Customer advisory board: 5 early customers who help shape the roadmap, attend 2 calls/year, and evangelize at banking conferences

---

## 22. Technical Architecture

### 22.1 Current Stack Assessment

| Component | Current | Notes |
|-----------|---------|-------|
| Frontend | Next.js 14, Tailwind CSS | Good. Solid, modern stack. |
| Backend | Next.js API routes | Will need to migrate heavier processing to dedicated backend at scale |
| Database | Supabase (PostgreSQL) | Good for now. Evaluate migration to direct PostgreSQL + PgBouncer at 100+ customers for compliance control |
| Auth | Supabase Auth | Replace with a more bank-grade auth solution (Okta, Auth0 with SAML/SSO) by first bank customer |
| AI | Anthropic Claude API | Good quality. Add OpenAI fallback for uptime redundancy |
| Hosting | Vercel | Must move to AWS or Azure by first bank customer — banks require US-only data residency and Vercel's infrastructure control is insufficient for SOC 2 |
| File storage | Supabase Storage | Replace with AWS S3 with customer-specific encryption keys |

### 22.2 Required Architecture Changes Before First Bank Customer

**Non-negotiables for enterprise bank deployments:**

| Change | Why | Timeline |
|--------|-----|----------|
| Migrate hosting from Vercel to AWS | Data residency, SOC 2 control requirements | Month 2 |
| Implement SSO (SAML 2.0, OIDC) | Every bank requires SSO integration with their identity provider | Month 2 |
| Customer data isolation | Each bank's data must be completely isolated — no shared database rows | Month 3 |
| Encryption at rest with customer-managed keys (BYOK) | Some banks require it; it's a differentiator | Month 4 |
| Comprehensive audit logging | Every action logged, tamper-evident, exportable | Month 2 |
| API rate limiting and DDoS protection | Required for SOC 2 | Month 2 |
| Data retention and deletion controls | GLBA compliance for financial data | Month 3 |

### 22.3 Financial Statement Spreading Architecture

The most technically complex feature — converting unstructured financial documents into structured data for analysis. Three approaches in order of build complexity:

**Option A (Month 1 workaround):** Require customers to paste financial data into structured templates manually. Removes spreading complexity. Reduces the product's value proposition.

**Option B (Month 3):** AI-assisted spreading — upload PDF, Claude extracts line items into structured fields, loan officer reviews and corrects. 60–70% automated, 30–40% human correction. Fast to build. Valuable immediately.

**Option C (Month 9):** Native OCR + AI spreading with validation rules. High accuracy on standard GAAP statements. Custom model trained on SBA loan financial statements. Full automation for clean statements, human review flagged for anomalies.

Build Option B first. Ship Option C when you have enough volume to train on.

---

## 23. Partnerships Strategy

### 23.1 LOS Integration Partnerships

Integrations are not nice-to-haves — they are the distribution moat. A co-sell agreement with an LOS vendor gives you access to their entire customer base.

**Priority targets:**

| LOS Vendor | Market Share (Community Banks) | Priority | Approach |
|-----------|-------------------------------|----------|----------|
| Baker Hill | ~30% of PLPs | P0 | Direct outreach to their partnerships team; pitch as AI layer on top of their spreading |
| nCino | ~20% of larger PLPs | P1 | nCino App Exchange (Salesforce AppExchange model); submit app |
| Finastra | ~15% | P1 | Finastra FusionFabric marketplace |
| Sagent | ~10% | P2 | Direct outreach |

**Partnership pitch to LOS vendors:**
> "We don't replace your platform. We sit on top of it. Your customers use you for loan origination. They use us for the AI analysis layer you haven't built. We can white-label as 'Powered by [LOS Vendor]' and you can offer us as an add-on to your enterprise customers."

### 23.2 SBA Ecosystem Partnerships

| Partner | Relationship | Value |
|---------|-------------|-------|
| SBA district offices | Informal endorsement | Warm intros to lenders in their district; district directors attend the same conferences you do |
| NAGGL (National Association of Government Guaranteed Lenders) | Conference presence, member directory | Access to every SBA PLP in one place |
| ICBA (Independent Community Bankers of America) | Member marketing, conference | Reach community bank CTOs and lending directors |
| CDFI Fund (Treasury) | CDFI member network | Pathway to mission-driven lender segment if PLP motion slows |

### 23.3 What Partnerships to Avoid in Year 1

- **Accounting software integrations (QuickBooks, Xero):** Builds dependency on a direct competitor's ecosystem
- **White-label for big banks:** Big bank customization requirements will derail your product roadmap
- **Revenue share with business brokers:** Complicates your B2B SaaS positioning and creates conflicts of interest

---

## 24. Exit Strategy

### 24.1 Most Likely Acquirers

This is not morbid planning — understanding your exit options informs how you build. Acquirers tell you what to over-invest in.

| Acquirer | Why They'd Buy | Likely Multiple | Timing |
|----------|---------------|-----------------|--------|
| Abrigo | Fastest path to AI narrative generation for their 2,400 customers | 6–10x ARR | $3–8M ARR |
| Baker Hill | Same as Abrigo — add AI to existing LOS product | 6–10x ARR | $3–8M ARR |
| nCino | Expand their AI capabilities for community bank segment | 8–12x ARR | $5–10M ARR |
| Intuit | SMB financial intelligence expansion | 10–15x ARR | Unlikely at small scale |
| Finastra | Broaden AI capabilities across their 8,500 institution client base | 8–12x ARR | $5M+ ARR |
| Private equity roll-up | Consolidate community bank fintech | 4–6x ARR | Any point |

### 24.2 Building for Acquisition Value

The features and metrics that drive acquisition premium:

| Value Driver | Why Acquirers Pay Up |
|-------------|---------------------|
| Deep LOS integrations | Immediately distributable to acquirer's customer base |
| Proprietary SBA valuation data | Non-replicable dataset; defensible product differentiation |
| High NRR (>115%) | Demonstrates product stickiness and expansion economics |
| SOC 2 Type II + pen test | Removes buyer's compliance due diligence burden |
| Named enterprise customer list | Existing revenue from acquirer's target market |

### 24.3 The IPO Path (Unlikely but Worth Mapping)

An IPO requires $50M+ ARR with strong growth. This is achievable only if:
- Expansion beyond SBA into all commercial lending (2,600 community banks × $18K ACV = $47M ARR)
- Platform economics (API-based model enabling third-party integrations)
- International expansion (SBA equivalent programs in Canada, UK, Australia)

For planning purposes: target a strategic acquisition at $5–15M ARR, $30–100M exit. Do not plan for IPO.

---

## 25. Founder Notes: The Things That Actually Kill Startups

These are not in the risk register because they are not strategic risks. They are execution failures. They kill more companies than competition does.

**Running out of money while waiting for a bank to sign.**  
Banks move slowly. You will have a customer who has been in procurement for 5 months, your runway is 6 weeks, and they need 3 more weeks. Budget for this. Always have 3 months of runway beyond your expected close dates. Never assume a close will happen on schedule.

**Building features instead of selling.**  
Every hour spent on a feature that no paying customer has asked for is an hour not spent closing the next deal. In months 0–12, the founders are the sales team. There is no other sales team. Sell first, build second.

**Hiring too early.**  
$1.5M in pre-seed capital sounds like a lot. At $50,000/month burn with 3 people, it is 30 months. At $100,000/month burn with 6 people, it is 15 months. The first hire should be someone who closes deals, not someone who builds features.

**Overbuilding the free tier.**  
If you ever offer a free tier to SBDCs, accountants, or anyone else to "build distribution," cap it at 5 accounts and sunset it after 90 days. Free users consume support time, distort your NPS data, and give investors a false picture of your customer base.

**Confusing activity with progress.**  
Conferences feel productive. Demos feel productive. Discovery calls feel productive. ARR is the only metric that matters before $1M. Track it weekly. Report it honestly.

**Not firing fast enough.**  
The wrong co-founder costs you 12 months and 20% of your cap table. The wrong first sales hire costs you 6 months and $150K. Make the call faster than feels comfortable.

---

*The plan is the starting point, not the destination. Every assumption in this document should be treated as a hypothesis to be tested, not a fact to be executed against. Update this document monthly. Strike through what turns out to be wrong. The founders who survive are the ones who change their minds faster than their competitors.*

---

**Document Owner:** Rushil Patil  
**Last Updated:** April 2026  
**Next Review:** May 2026  
**Version History:** v1.0 Initial release · v1.1 Added sections 16–25
