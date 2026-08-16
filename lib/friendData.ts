import { createClient } from '@/utils/supabase/client';
import { FriendRecord } from "../types/friends";

export const sendFriendRequest = async (toUserId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return false;

    const { error } = await supabase.from('friends').insert({
        user_id: user.id,
        friend_id: toUserId,
        status: 'pending',
    });

    if (error) {
        console.error('Error sending friend request:', error);
        return false;
    }

    return true;
};

export const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('friends')
        .update({ status: 'accepted' }) // <-- без "accept"
        .eq('id', requestId)
        .select(); // Поверне оновлений запис

    if (error) {
        console.error('❌ Error accepting friend request:', error);
        return false;
    }

    console.log('✅ Friend request accepted:', data);
    return true;
};

export const declineFriendRequest = async (requestId: string): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', requestId)
        .eq('status', 'pending'); // додатковий захист

    if (error) {
        console.error('❌ Error declining friend request:', error);
        return false;
    }

    return true;
};


export const cancelFriendRequest = async (friendId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: record, error: findError } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', user.id)
        .eq('friend_id', friendId)
        .eq('status', 'pending')
        .single();

    if (findError || !record) {
        console.error('❌ Cannot find request to cancel:', findError);
        return false;
    }

    const { error: deleteError } = await supabase
        .from('friends')
        .delete()
        .eq('id', record.id);

    if (deleteError) {
        console.error('❌ Error deleting by id:', deleteError);
        return false;
    }

    return true;
};

export const fetchIncomingFriendRequests = async (userId: string): Promise<FriendRecord[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('friend_id', userId)
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching incoming friend requests:', error);
        return [];
    }

    return data;
};

export const getAllFriendsOfUser = async (userId: string): Promise<FriendRecord[]> => {
    console.log(userId)
    const supabase = createClient();
    const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');


    if (error) {
        console.error('Error fetching friends:', error);
        return [];
    }

    return data;
};

export const removeFriendship = async (otherUserId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_id.eq.${user.id})`)
        .eq('status', 'accepted');

    if (error) {
        console.error('❌ Error removing friendship:', error);
        return false;
    }

    return true;
};

export const getOutgoingPendingRequests = async (userId: string): Promise<string[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'pending');

    if (error || !data) return [];

    return data.map(r => r.friend_id);
};

// Both directions, any status, one row per relationship -- unlike
// getAllFriendsOfUser above (accepted only, kept as-is since userList.tsx
// already depends on that exact shape). Added for the profile page's
// friend/trainer action buttons, which need to tell "no relationship" from
// "outgoing pending" from "incoming pending" for one specific other user,
// not just "are we friends".
export const getAllFriendLinksOfUser = async (userId: string): Promise<FriendRecord[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (error) {
        console.error('Error fetching friend links:', error);
        return [];
    }

    return data ?? [];
};

export type FriendshipState =
    | { status: 'none' }
    | { status: 'outgoing'; requestId: string }
    | { status: 'incoming'; requestId: string }
    | { status: 'accepted' };

// Derives the viewer's relationship to one other user from the full
// two-directional list getAllFriendLinksOfUser returns.
export const getFriendshipState = (
    links: FriendRecord[],
    viewerId: string,
    otherUserId: string,
): FriendshipState => {
    const match = links.find(
        (link) =>
            (link.user_id === viewerId && link.friend_id === otherUserId) ||
            (link.friend_id === viewerId && link.user_id === otherUserId),
    );
    if (!match) return { status: 'none' };
    if (match.status === 'accepted') return { status: 'accepted' };
    if (match.status === 'pending') {
        return match.user_id === viewerId
            ? { status: 'outgoing', requestId: match.id }
            : { status: 'incoming', requestId: match.id };
    }
    return { status: 'none' };
};