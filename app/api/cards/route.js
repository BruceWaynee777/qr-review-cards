import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cards: data });
}

export async function POST(request) {
  const { id } = await request.json();
  if (!id || !id.trim()) {
    return NextResponse.json({ error: 'Card number is required' }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('cards')
    .insert({ id: id.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ card: data });
}
