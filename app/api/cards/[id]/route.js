import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase';

export async function PUT(request, { params }) {
  const { shop_name, review_link } = await request.json();
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from('cards')
    .update({ shop_name, review_link })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ card: data });
}

export async function DELETE(request, { params }) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from('cards').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
