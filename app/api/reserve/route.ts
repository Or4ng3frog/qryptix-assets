import { NextRequest, NextResponse } from 'next/server';

// ============================================================
//  Reservation endpoint
//  Stores email + wallet + intended amount. No payment taken.
//
//  TODO before production:
//  - Persist to a database (Postgres / Supabase) OR
//  - Forward to Brevo as a contact (you already use Brevo on CoinMinerElite)
//  - Add rate limiting + email validation + wallet checksum validation
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { email, wallet, usdc, phase } = await req.json();

    if (!email || !wallet) {
      return NextResponse.json({ error: 'Email and wallet required' }, { status: 400 });
    }

    // --- Option A: Brevo contact (uncomment + set BREVO_API_KEY) ---
    // await fetch('https://api.brevo.com/v3/contacts', {
    //   method: 'POST',
    //   headers: {
    //     'api-key': process.env.BREVO_API_KEY!,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     attributes: { WALLET: wallet, USDC_INTENT: usdc, PHASE: phase },
    //     listIds: [Number(process.env.BREVO_RESERVATION_LIST_ID)],
    //     updateEnabled: true,
    //   }),
    // });

    // --- Option B: log for now (preview) ---
    console.log('[RESERVATION]', { email, wallet, usdc, phase, at: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
