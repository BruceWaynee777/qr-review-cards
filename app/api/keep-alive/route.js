import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

// Vercel Cron hits this once a day (see vercel.json). A real database read
// resets Supabase's 7-day inactivity clock, so the free-tier project never
// auto-pauses from lack of traffic. It also records the timestamp so the
// admin dashboard can show you proof it's actually running.
export async function GET() {
  const supabase = getSupabaseServer();
  await supabase.from('cards').select('id').limit(1);
  await supabase
    .from('system_status')
    .update({ last_ping: new Date().toISOString() })
    .eq('id', 1);
  return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
}
