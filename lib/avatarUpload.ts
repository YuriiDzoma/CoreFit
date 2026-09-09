import { createClient } from '@/utils/supabase/client';

const AVATARS_BUCKET = 'avatars';
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export class AvatarTooLargeError extends Error {}

// A fresh timestamped filename per upload (not a fixed name overwritten in
// place) sidesteps browser/CDN caching an old photo under the same URL --
// the tradeoff is old files need their own cleanup, see deleteAvatarFile.
export async function uploadAvatar(userId: string, file: File): Promise<string> {
    if (file.size > MAX_AVATAR_BYTES) {
        throw new AvatarTooLargeError('Avatar file is too large');
    }

    const supabase = createClient();
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `${userId}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage.from(AVATARS_BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// Best-effort, and a deliberate no-op for anything that isn't one of our
// own uploaded files (a Google photo URL or a ui-avatars.com fallback --
// we don't own either of those, and must never try to delete them).
export async function deleteAvatarFile(url: string | null | undefined): Promise<void> {
    if (!url) return;

    const marker = `/storage/v1/object/public/${AVATARS_BUCKET}/`;
    const index = url.indexOf(marker);
    if (index === -1) return;

    const path = decodeURIComponent(url.slice(index + marker.length));
    const supabase = createClient();

    await supabase.storage.from(AVATARS_BUCKET).remove([path]).catch(() => {});
}
