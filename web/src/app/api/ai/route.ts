import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { AiRequest } from '@/lib/types';

function buildSystemPrompt(req: AiRequest): string {
  const b = req.business;
  const bs = req.balanceSheetItems || [];
  const assets = bs.filter(i => i.type === 'ASSET').reduce((s, i) => s + i.value, 0);
  const liabilities = bs.filter(i => i.type === 'LIABILITY').reduce((s, i) => s + i.value, 0);
  const equity = assets - liabilities;

  const businessContext = `
## Borrower Profile
- Name: ${b.business_name}
- Industry: ${b.industry || 'Not specified'}
- Employees: ${b.employees}
- Annual Revenue: $${b.annual_revenue.toLocaleString()}
- Net Income: $${b.net_income.toLocaleString()}
- EBIT: $${b.ebit.toLocaleString()}
- Interest Expense: $${b.interest_expense.toLocaleString()}
- Total Assets: $${assets.toLocaleString()}
- Total Liabilities: $${liabilities.toLocaleString()}
- Net Equity: $${equity.toLocaleString()}
${b.business_description ? `- Description: ${b.business_description}` : ''}
  `.trim();

  const prompts: Record<string, string> = {
    advisor: `You are an expert SBA loan underwriter and financial analyst at a Preferred Lender Program (PLP) institution. You provide clear, analytical, and actionable underwriting guidance to loan officers. Always respond in markdown format. Be concise but thorough. Focus on SBA 7(a) underwriting standards, DSCR analysis, and credit risk assessment. Current borrower context:\n\n${businessContext}`,

    'credit-memo': `You are a senior SBA loan officer at a Preferred Lender Program (PLP) institution writing an internal credit memo for a 7(a) loan file. Your credit memos are structured, professional, and meet SBA underwriting standards. Format in markdown with clear section headers. Be analytical and objective — note both strengths and risks. Always include disclaimers that this is analytical support requiring loan officer review and does not constitute a credit opinion or lending recommendation. Borrower context:\n\n${businessContext}`,

    'sba-analysis': `You are a senior SBA underwriting analyst at a Preferred Lender Program institution. Provide a comprehensive SBA 7(a) underwriting analysis including DSCR assessment, financial strength evaluation, risk factors, and SBA eligibility considerations. Format in markdown. Borrower context:\n\n${businessContext}`,

    valuation: `You are a senior SBA underwriter estimating the fair market value of a borrower's business for collateral assessment purposes. Provide a detailed valuation analysis using: Revenue Multiple, EBITDA Multiple, and DCF methods. Give a blended valuation range with clear reasoning. Format in markdown. Note this is for analytical support and requires loan officer review. Borrower context:\n\n${businessContext}`,

    buyers: `You are a senior M&A advisor identifying potential acquirers for this business. Identify 5–8 specific types of strategic and financial buyers with rationale, estimated offer range, and recommended first steps. Format in markdown. Business context:\n\n${businessContext}`,

    strategy: `You are a capital markets advisor analyzing capital-raising options for this business. Analyze: SBA 7(a) Loan, SBA 504 Loan, USDA B&I Loan, Bank Term Loan, Equipment Financing, and Revenue-Based Financing. For each: fit, pros, cons, typical terms. Format in markdown. Business context:\n\n${businessContext}`,

    cim: `You are a senior investment banker writing a Confidential Information Memorandum (CIM) teaser. Write a 1-page Executive Summary with: Business Overview, Investment Highlights, Financial Snapshot, Growth Opportunities, and Transaction Considerations. Professional, polished tone. Format in markdown. Business context:\n\n${businessContext}`,

    'dd-report': `You are an SBA due diligence specialist. Evaluate this borrower against 12 standard DD categories for SBA 7(a) lending: (1) Financial Statements Quality, (2) Revenue Quality & Concentration, (3) Customer Contracts, (4) Debt Schedule, (5) IP & Technology, (6) HR & Org Structure, (7) Legal & Litigation, (8) SBA Eligibility, (9) Operational Processes, (10) Facilities & Equipment, (11) Environmental, (12) Insurance. Provide overall assessment, key risks, action plan, and estimated timeline. Format in markdown. Borrower context:\n\n${businessContext}`,

    'buyer-view': `You are a buy-side PE analyst writing an internal deal memo. Write a memo covering: Executive Summary, Business Quality Assessment, Financial Analysis & Red Flags, Preliminary DD Questions, Key Risks, and Preliminary Valuation. Objective, analytical, skeptical tone. Format in markdown. Business context:\n\n${businessContext}`,

    'value-drivers': `You are an SBA advisor identifying actions to strengthen this borrower's credit profile and business value. Identify 6–8 specific, ranked actions with: estimated impact on DSCR/valuation, implementation timeline, difficulty (easy/medium/hard), and specific steps. Sort by impact. Format in markdown. Business context:\n\n${businessContext}`,
  };

  return prompts[req.type] || prompts.advisor;
}

function buildUserMessage(req: AiRequest): string {
  const addBacks = req.addBacks || [];
  const adjustedEbitda = req.business.ebit + addBacks.reduce((s, a) => s + a.amount, 0);

  if (req.type === 'credit-memo' && req.message) return req.message;
  if (req.type === 'sba-analysis') {
    const dscr = req.dscrData;
    return dscr
      ? `Provide a comprehensive SBA underwriting analysis. Key metrics: Proposed debt service: $${dscr.proposedDebtService.toLocaleString()}/year, Existing debt service: $${dscr.existingDebtService.toLocaleString()}/year, Owner add-backs: $${(dscr.ownerSalary + dscr.ownerPerks + dscr.depreciation + dscr.nonRecurring).toLocaleString()}, Total debt: $${dscr.totalLiabilities.toLocaleString()}, Tax rate: ${dscr.taxRate}%.`
      : 'Provide a comprehensive SBA 7(a) underwriting analysis for this borrower.';
  }

  switch (req.type) {
    case 'advisor': return req.message || 'How can I help with this SBA loan analysis today?';
    case 'valuation': return `Provide a comprehensive business valuation analysis for collateral assessment purposes. EBITDA Add-Backs total $${addBacks.reduce((s, a) => s + a.amount, 0).toLocaleString()}, giving Adjusted EBITDA of $${adjustedEbitda.toLocaleString()}.`;
    case 'buyers': return 'Who are the most likely acquirers for this business and what would motivate them?';
    case 'strategy': return `What are the best capital-raising options for this business given current financials?${req.raiseAmount ? ` Looking to raise approximately $${req.raiseAmount.toLocaleString()}.` : ''}`;
    case 'cim': return `Write a CIM Executive Summary. Additional context: Description: ${req.cimFields?.description || req.business.business_description || 'N/A'}. Growth: ${req.cimFields?.growth || req.business.growth_story || 'N/A'}. Moat: ${req.cimFields?.moat || req.business.competitive_moat || 'N/A'}. Reason for sale: ${req.cimFields?.reason || req.business.reason_for_sale || 'N/A'}. Owner role: ${req.cimFields?.ownerRole || req.business.owner_role || 'N/A'}.`;
    case 'dd-report': {
      const ddItems = req.ddChecks?.filter(c => c.is_complete).map(c => c.item_key).join(', ') || 'None completed';
      return `Assess this borrower's SBA due diligence readiness. Completed DD items: ${ddItems}.`;
    }
    case 'buyer-view': return 'Write an internal buy-side deal memo for this business as if you were a PE analyst evaluating a potential acquisition.';
    case 'value-drivers': return 'What are the highest-impact actions this borrower can take to strengthen their credit profile and business value?';
    default: return req.message || '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AiRequest = await request.json();

    const apiKey = body.business?.anthropic_api_key || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No Anthropic API key configured. Add one in Settings or contact support.' },
        { status: 402 }
      );
    }

    const client = new Anthropic({ apiKey });

    const model =
      body.type === 'advisor' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6';

    const systemPrompt = buildSystemPrompt(body);
    const userMessage = buildUserMessage(body);

    const messages: Anthropic.Messages.MessageParam[] = [];

    if (body.type === 'advisor' && body.history && body.history.length > 0) {
      const recent = body.history.slice(-10);
      recent.forEach(h => {
        messages.push({ role: h.role, content: h.content });
      });
    }

    messages.push({ role: 'user', content: userMessage });

    const response = await client.messages.create({
      model,
      max_tokens: body.type === 'credit-memo' ? 4096 : 2048,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        } as any,
      ],
      messages,
    });

    const text = response.content
      .filter(c => c.type === 'text')
      .map(c => (c as Anthropic.Messages.TextBlock).text)
      .join('');

    return NextResponse.json({ result: text });
  } catch (err: unknown) {
    console.error('AI route error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
