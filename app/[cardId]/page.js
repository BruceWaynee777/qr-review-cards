import { redirect } from 'next/navigation';
import { getSupabaseServer } from '../../lib/supabase';

export default async function CardRedirectPage({ params }) {
  const supabase = getSupabaseServer();

  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', params.cardId)
    .single();

  if (card && card.review_link) {
    // Awaited so it reliably finishes before the serverless function ends.
    await supabase
      .from('cards')
      .update({ scan_count: (card.scan_count || 0) + 1 })
      .eq('id', params.cardId);

    redirect(card.review_link);
  }

  return (
    <main className="hl-shell">
      <div className="hl-notice">
        <p className="hl-eyebrow">Card {params.cardId}</p>
        <h1>Not set up yet</h1>
        <p>This card hasn&apos;t been assigned to a business. Check back shortly.</p>
      </div>
    </main>
  );
}
