import { createClient } from '@/utils/supabase/client';
import {FriendRecord} from "../types/friends";

export const sendFriendRequest = async (toUserId: string): Promise<boolean> => {
    const supabase = createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

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

export const getAllFriendsOfUser = async (userId: string): Promise<FriendRecord[]> => {
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

export const respondToFriendRequest = async (requestId: string, accept: boolean): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('friends')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId);

    if (error) {
        console.error('Error responding to friend request:', error);
        return false;
    }

    return true;
};

export const getSentFriendRequests = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('friends')
        .select('friend_id, status')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching sent friend requests:', error);
        return [];
    }

    return data;
};

export const cancelFriendRequest = async (friendId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
        .from('friends')
        .delete()
        .match({
            user_id: user.id,
            friend_id: friendId,
            status: 'pending',
        });

    if (error) {
        console.error('❌ Error cancelling request:', error);
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
