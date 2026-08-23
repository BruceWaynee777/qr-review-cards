import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

export async function GET() {
  const supabase = getSupabaseServer();
  await supabase.from('cards').select('id').limit(1);
  const { error } = await supabase
    .from('system_status')
    .update({ last_ping: new Date().toISOString() })
    .eq('id', 1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
}
