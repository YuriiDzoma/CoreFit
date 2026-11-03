import { createClient } from '@/utils/supabase/client';
import { AVATARS_BUCKET } from '@/lib/avatarUpload';

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
    await deleteOwnAvatarFiles(supabase);
    const { error } = await supabase.rpc('delete_own_account');

    if (error) {
        console.error('Error deleting account:', error);
        return false;
    }

    return true;
};

// The RPC can't reach Storage, so uploaded profile photos (every file in
// avatars/<userId>/, old ones included) are removed first, while the
// session still exists to authorize it. Best-effort: a leftover file must
// not block deleting the account itself.
async function deleteOwnAvatarFiles(supabase: ReturnType<typeof createClient>): Promise<void> {
    try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) return;

        const bucket = supabase.storage.from(AVATARS_BUCKET);
        const { data: files } = await bucket.list(userId, { limit: 1000 });
        if (!files?.length) return;
        await bucket.remove(files.map((file) => `${userId}/${file.name}`));
    } catch (error) {
        console.error('Error deleting avatar files:', error);
    }
}
