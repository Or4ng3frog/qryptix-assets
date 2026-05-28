import { NextRequest, NextResponse } from 'next/server';

// Hardware miner interest registration. Non-binding, no payment.
export async function POST(req: NextRequest) {
  try {
    const { email, tier } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    console.log('[MINER_INTEREST]', { email, tier, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
