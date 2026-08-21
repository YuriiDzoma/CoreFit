import { createClient } from '@/utils/supabase/client';

// Boolean return + console.error on failure, matching this file's own
// sibling lib/trainerClientData.ts (removeTrainerRelationship etc.) --
// this repo's established idiom, not the mobile app's throw-on-error
// shape. The `delete_own_account` RPC (mobile repo's migrations --
// shared Supabase project) is scoped entirely to auth.uid() server-side,
// so there's no id to pass here. Callers must still explicitly sign out
// afterward -- this only removes the account, it doesn't clear the now-
// stale local session.
export const deleteOwnAccount = async (): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase.rpc('delete_own_account');

    if (error) {
        console.error('Error deleting account:', error);
        return false;
    }

    return true;
};
