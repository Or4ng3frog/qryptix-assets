import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // verify admin
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { type, id, status, tx_hash } = await req.json();

    if (type === 'purchase') {
      const patch: any = { status };
      if (status === 'confirmed') patch.confirmed_at = new Date().toISOString();
      if (tx_hash) patch.tx_hash = tx_hash;
      const { error } = await supabase.from('purchases').update(patch).eq('id', id);
      if (error) throw error;
    } else if (type === 'refund') {
      const patch: any = { status };
      if (status === 'under_review' || status === 'approved' || status === 'rejected') {
        patch.reviewed_at = new Date().toISOString();
      }
      if (status === 'paid') {
        patch.refunded_at = new Date().toISOString();
        if (tx_hash) patch.refund_tx_hash = tx_hash;
      }
      const { error } = await supabase.from('refund_requests').update(patch).eq('id', id);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    await supabase.from('audit_log').insert({
      actor_id: user.id,
      action: `admin_update_${type}`,
      entity: type,
      entity_id: id,
      meta: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 400 });
  }
}
