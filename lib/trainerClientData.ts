import { createClient } from '@/utils/supabase/client';
import { TrainerClientRecord } from '../types/trainerClient';

// Mirrors lib/friendData.ts's conventions exactly (boolean returns,
// console.error on failure, createClient() per call) rather than the
// mobile app's throw-on-error shape -- this file follows this repo's own
// established idiom, not the mobile one. A client invites an
// already-accepted, self-declared-trainer friend to become their
// trainer; the trainer confirms. RLS (trainer_clients table, mobile
// repo's migrations -- shared Supabase project) already enforces both
// the friendship requirement and the is_trainer roles server-side; these
// calls just supply the ids.

export const sendTrainerRequest = async (trainerId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return false;

    const { error } = await supabase.from('trainer_clients').insert({
        client_id: user.id,
        trainer_id: trainerId,
        status: 'pending',
    });

    if (error) {
        console.error('Error sending trainer request:', error);
        return false;
    }

    return true;
};

export const acceptTrainerRequest = async (requestId: string): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('trainer_clients')
        .update({ status: 'accepted' })
        .eq('id', requestId);

    if (error) {
        console.error('Error accepting trainer request:', error);
        return false;
    }

    return true;
};

export const declineTrainerRequest = async (requestId: string): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('trainer_clients')
        .delete()
        .eq('id', requestId)
        .eq('status', 'pending');

    if (error) {
        console.error('Error declining trainer request:', error);
        return false;
    }

    return true;
};

export const cancelTrainerRequest = async (trainerId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: record, error: findError } = await supabase
        .from('trainer_clients')
        .select('id')
        .eq('client_id', user.id)
        .eq('trainer_id', trainerId)
        .eq('status', 'pending')
        .single();

    if (findError || !record) {
        console.error('Cannot find trainer request to cancel:', findError);
        return false;
    }

    const { error: deleteError } = await supabase
        .from('trainer_clients')
        .delete()
        .eq('id', record.id);

    if (deleteError) {
        console.error('Error cancelling trainer request:', deleteError);
        return false;
    }

    return true;
};

export const removeTrainerRelationship = async (otherUserId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('trainer_clients')
        .delete()
        .or(`and(trainer_id.eq.${user.id},client_id.eq.${otherUserId}),and(client_id.eq.${user.id},trainer_id.eq.${otherUserId})`)
        .eq('status', 'accepted');

    if (error) {
        console.error('Error removing trainer relationship:', error);
        return false;
    }

    return true;
};

export const fetchIncomingTrainerRequests = async (userId: string): Promise<TrainerClientRecord[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('trainer_clients')
        .select('*')
        .eq('trainer_id', userId)
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching incoming trainer requests:', error);
        return [];
    }

    return data ?? [];
};

// Both directions, any status -- same shape as friendData.ts's
// getAllFriendLinksOfUser, for the same reason (the profile page needs to
// tell none/outgoing/incoming/accepted apart for one specific other
// user).
export const getAllTrainerLinksOfUser = async (userId: string): Promise<TrainerClientRecord[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('trainer_clients')
        .select('*')
        .or(`trainer_id.eq.${userId},client_id.eq.${userId}`);

    if (error) {
        console.error('Error fetching trainer links:', error);
        return [];
    }

    return data ?? [];
};

// Backed by a SECURITY DEFINER RPC, not a plain select -- the SELECT RLS
// policy on trainer_clients only lets a user read relationships they're
// personally part of, so a profile that isn't the viewer's own would
// otherwise be invisible here entirely. The RPC returns only a count,
// never the underlying rows, so this can't be used to learn who a
// trainer's clients actually are.
export const getTrainerClientCount = async (trainerId: string): Promise<number> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_trainer_client_count', {
        target_trainer_id: trainerId,
    });

    if (error) {
        console.error('Error fetching trainer client count:', error);
        return 0;
    }

    return data ?? 0;
};

export type TrainerTier = 'iron' | 'bronze' | 'silver' | 'gold';

// Thresholds are a product decision, not derived from anything -- chosen
// alongside the badge's visual design (mobile repo's docs/decisions.md).
// `0` returns `null` (no badge at all) rather than a tier, matching this
// app's existing "don't show an empty state, just hide the block"
// convention.
export const getTrainerTier = (clientCount: number): TrainerTier | null => {
    if (clientCount <= 0) return null;
    if (clientCount <= 5) return 'iron';
    if (clientCount <= 10) return 'bronze';
    if (clientCount <= 15) return 'silver';
    return 'gold';
};

export type TrainerClientState =
    | { status: 'none' }
    | { status: 'outgoing'; requestId: string }
    | { status: 'incoming'; requestId: string }
    | { status: 'accepted'; requestId: string };

// 'accepted' doesn't itself say which role the viewer has (trainer or
// client) -- both directions collapse to the same status. Callers resolve
// that from the matching record in `links` (via the returned `requestId`)
// only where the distinction actually matters for display, same as the
// mobile app's own trainer-clients.ts.
export const getTrainerClientState = (
    links: TrainerClientRecord[],
    viewerId: string,
    otherUserId: string,
): TrainerClientState => {
    const match = links.find(
        (link) =>
            (link.client_id === viewerId && link.trainer_id === otherUserId) ||
            (link.trainer_id === viewerId && link.client_id === otherUserId),
    );
    if (!match) return { status: 'none' };
    if (match.status === 'accepted') return { status: 'accepted', requestId: match.id };
    if (match.status === 'pending') {
        return match.client_id === viewerId
            ? { status: 'outgoing', requestId: match.id }
            : { status: 'incoming', requestId: match.id };
    }
    return { status: 'none' };
};
