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
## Business Profile
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
${b.growth_story ? `- Growth Story: ${b.growth_story}` : ''}
${b.competitive_moat ? `- Competitive Moat: ${b.competitive_moat}` : ''}
${b.reason_for_sale ? `- Reason for Sale: ${b.reason_for_sale}` : ''}
${b.owner_role ? `- Owner Role: ${b.owner_role}` : ''}
  `.trim();

  const prompts: Record<string, string> = {
    advisor: `You are an expert M&A and financial advisor for small and mid-size businesses. You give clear, actionable, sophisticated financial guidance. Always respond in markdown format. Be concise but thorough. Current business context:\n\n${businessContext}`,
    valuation: `You are a senior M&A advisor estimating the fair market value of a small business. Provide a detailed valuation analysis using three methods: Revenue Multiple, EBITDA Multiple, and DCF (assume 5% terminal growth rate). Give a blended valuation range with clear reasoning. Format in markdown with sections. Business context:\n\n${businessContext}`,
    buyers: `You are a senior M&A advisor identifying potential acquirers. Identify 5–8 specific types of strategic and financial buyers with rationale for each, estimated offer range, and recommended first steps. Format in markdown. Business context:\n\n${businessContext}`,
    strategy: `You are a capital markets advisor for SMBs. Analyze the best capital-raising options including: SBA 7(a) Loan, Bank Term Loan, Equipment Financing, Revenue-Based Financing, and PE Recapitalization. For each option, discuss fit, pros, cons, and typical terms. Format in markdown. Business context:\n\n${businessContext}`,
    cim: `You are a senior investment banker writing a Confidential Information Memorandum (CIM) teaser. Write a 1-page Executive Summary with sections: Business Overview, Investment Highlights, Financial Snapshot, Growth Opportunities, and Transaction Considerations. Professional, polished tone. Format in markdown. Business context:\n\n${businessContext}`,
    'dd-report': `You are an M&A due diligence readiness assessor. Evaluate the business against 12 standard DD categories: (1) Financial Statements, (2) Revenue Quality, (3) Customer Concentration, (4) Contracts & Agreements, (5) IP & Technology, (6) HR & Org Structure, (7) Legal & Litigation, (8) Regulatory Compliance, (9) Operational Processes, (10) Facilities & Equipment, (11) Environmental, (12) Insurance. Provide overall assessment, key risks, action plan, and estimated timeline. Format in markdown. Business context:\n\n${businessContext}`,
    'buyer-view': `You are a buy-side PE analyst writing an internal deal memo. Write a memo covering: Executive Summary, Business Quality Assessment, Financial Analysis & Red Flags, Preliminary DD Questions, Key Risks, and Preliminary Valuation. Objective, analytical, skeptical tone. Format in markdown. Business context:\n\n${businessContext}`,
    'value-drivers': `You are an M&A value-creation advisor. Identify 6–8 specific, ranked actions to increase business value before a sale. For each action: estimated valuation impact, implementation timeline, difficulty (easy/medium/hard), and specific steps. Sort by impact. Format in markdown. Business context:\n\n${businessContext}`,
  };

  return prompts[req.type] || prompts.advisor;
}

function buildUserMessage(req: AiRequest): string {
  const addBacks = req.addBacks || [];
  const adjustedEbitda = req.business.ebit + addBacks.reduce((s, a) => s + a.amount, 0);

  switch (req.type) {
    case 'advisor':
      return req.message || 'How can you help me today?';
    case 'valuation':
      return `Please provide a comprehensive valuation analysis for my business. EBITDA Add-Backs total $${addBacks.reduce((s, a) => s + a.amount, 0).toLocaleString()}, giving Adjusted EBITDA of $${adjustedEbitda.toLocaleString()}.`;
    case 'buyers':
      return `Who are the most likely acquirers for my business and what would motivate them to buy?`;
    case 'strategy':
      return `What are the best capital-raising options for my business given my current financials?${req.raiseAmount ? ` I'm looking to raise approximately $${req.raiseAmount.toLocaleString()}.` : ''}`;
    case 'cim':
      return `Write a CIM Executive Summary for my business. Additional context: Description: ${req.cimFields?.description || req.business.business_description || 'N/A'}. Growth: ${req.cimFields?.growth || req.business.growth_story || 'N/A'}. Moat: ${req.cimFields?.moat || req.business.competitive_moat || 'N/A'}. Reason for sale: ${req.cimFields?.reason || req.business.reason_for_sale || 'N/A'}. Owner role: ${req.cimFields?.ownerRole || req.business.owner_role || 'N/A'}.`;
    case 'dd-report': {
      const ddItems = req.ddChecks?.filter(c => c.is_complete).map(c => c.item_key).join(', ') || 'None completed';
      return `Assess my business's due diligence readiness. Completed DD items: ${ddItems}.`;
    }
    case 'buyer-view':
      return `Write an internal buy-side deal memo for my business as if you were a PE analyst evaluating a potential acquisition.`;
    case 'value-drivers':
      return `What are the highest-impact actions I can take to increase my business's value before going to market?`;
    default:
      return req.message || '';
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
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
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
