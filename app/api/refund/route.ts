import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  // Preview mode — no Supabase
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const { purchase_id, reason } = await req.json();
    if (!purchase_id) {
      return NextResponse.json({ error: 'purchase_id required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // Verify the purchase belongs to this user and is confirmed
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id, status, user_id')
      .eq('id', purchase_id)
      .single();

    if (!purchase || purchase.user_id !== user.id) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }
    if (purchase.status !== 'confirmed') {
      return NextResponse.json({ error: 'Only confirmed purchases can be refunded' }, { status: 400 });
    }

    const { error } = await supabase.from('refund_requests').insert({
      user_id: user.id,
      purchase_id,
      reason: reason || null,
      status: 'requested',
    });
    if (error) throw error;

    // audit log (best-effort)
    await supabase.from('audit_log').insert({
      actor_id: user.id,
      action: 'refund_requested',
      entity: 'purchase',
      entity_id: purchase_id,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 400 });
  }
}
