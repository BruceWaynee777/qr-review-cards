import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('system_status')
    .select('last_ping')
    .eq('id', 1)
    .single();

  return NextResponse.json({ last_ping: data?.last_ping || null });
}
