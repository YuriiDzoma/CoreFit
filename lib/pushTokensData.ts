import { createClient } from '@/utils/supabase/client';

/**
 * All direct Supabase calls against `push_tokens` live here -- mirrors the
 * mobile app's own `src/lib/supabase/push-tokens.ts` exactly (same table,
 * same upsert-on-(platform,token) shape). One row per device/browser; the
 * `send-message-push` Edge Function reads this table (service role,
 * bypassing RLS) to know where to deliver a push for a new message.
 * `platform: 'web'` rows store a JSON-stringified `PushSubscription`
 * (endpoint + keys) as `token`, delivered via the Web Push protocol
 * rather than Expo's push service.
 */

export async function upsertPushToken(
    userId: string,
    platform: 'expo' | 'web',
    token: string
): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('push_tokens')
        .upsert({ user_id: userId, platform, token }, { onConflict: 'platform,token' });
    if (error) throw error;
}

export async function removePushToken(platform: 'expo' | 'web', token: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('platform', platform)
        .eq('token', token);
    if (error) throw error;
}
