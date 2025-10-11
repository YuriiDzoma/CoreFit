import 'server-only';
import Friends from './Friends';
import { createServerSupabase } from '@/lib/supabase/server';
import type { ProfileType } from '@/types/user';

type FriendLink = { user_id: string; friend_id: string };

export default async function FriendsServer({ id }: { id: string }) {
    const sb = await createServerSupabase();

    const { data: linksRaw, error: linksErr } = await sb
        .from('friends')
        .select('*')
        .or(`user_id.eq.${id},friend_id.eq.${id}`)
        .eq('status', 'accepted');

    if (linksErr) {
        return <Friends id={id} initial={[]} />;
    }

    const links: FriendLink[] = linksRaw ?? [];
    if (links.length === 0) {
        return <Friends id={id} initial={[]} />;
    }

    const friendIds: string[] = links.map((r) =>
        r.user_id === id ? r.friend_id : r.user_id
    );

    if (friendIds.length === 0) {
        return <Friends id={id} initial={[]} />;
    }

    const { data: profilesRaw, error: profErr } = await sb
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .in('id', friendIds)
        .limit(12);

    if (profErr) {
        return <Friends id={id} initial={[]} />;
    }

    const profiles: ProfileType[] = (profilesRaw ?? []) as ProfileType[];

    return <Friends id={id} initial={profiles} />;
}
