import 'server-only';
import TrainerClients from './TrainerClients';
import { createServerSupabase } from '@/lib/supabase/server';
import type { ProfileType } from '@/types/user';

type TrainerClientLink = { trainer_id: string; client_id: string };

// Clients if this profile is a trainer (people who accepted them), their
// own trainer otherwise (accepted, the other direction) -- never both,
// and never an empty-state prompt when there's neither, same rule
// Friends.server.tsx's own callers already follow.
export default async function TrainerClientsServer({
    id,
    isTrainer,
}: {
    id: string;
    isTrainer: boolean;
}) {
    const sb = await createServerSupabase();

    const { data: linksRaw, error: linksErr } = await sb
        .from('trainer_clients')
        .select('trainer_id, client_id')
        .eq(isTrainer ? 'trainer_id' : 'client_id', id)
        .eq('status', 'accepted');

    if (linksErr) return null;

    const links: TrainerClientLink[] = linksRaw ?? [];
    if (links.length === 0) return null;

    const otherIds = links.map((link) => (isTrainer ? link.client_id : link.trainer_id));
    if (otherIds.length === 0) return null;

    const { data: profilesRaw, error: profErr } = await sb
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .in('id', otherIds)
        .limit(12);

    if (profErr) return null;

    const profiles: ProfileType[] = (profilesRaw ?? []) as ProfileType[];
    if (profiles.length === 0) return null;

    return <TrainerClients isTrainer={isTrainer} people={profiles} />;
}
