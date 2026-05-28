import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Records a purchase. The on-chain transfer happens client-side; this endpoint
// persists the record with status 'pending' until admin/automation confirms it.
export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const body = await req.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      wallet_address: body.wallet_address ?? null,
      amount_paid: body.amount_paid,
      payment_currency: body.payment_currency,
      amount_paid_usd: body.amount_paid_usd ?? null,
      qtx_amount: body.qtx_amount,
      presale_stage: body.presale_stage ? Number(body.presale_stage) : null,
      tx_hash: body.tx_hash ?? null,
      status: body.status === 'confirmed' ? 'confirmed' : 'pending',
    });
    if (error) throw error;

    await supabase.from('audit_log').insert({
      actor_id: user.id,
      action: 'purchase_recorded',
      entity: 'purchase',
      meta: { tx_hash: body.tx_hash, currency: body.payment_currency, usd: body.amount_paid_usd },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 400 });
  }
}
