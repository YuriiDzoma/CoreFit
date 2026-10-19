import { upsertPushToken } from '@/lib/pushTokensData';

// Web Push subscription keys arrive base64url-encoded; `PushManager.subscribe`
// needs them as a raw `Uint8Array` instead -- standard conversion, no
// browser API does this step itself.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Requests Notification permission (a no-op if already granted or already
 * permanently denied) and, if granted, subscribes this browser to Web
 * Push and registers the subscription against `userId`. Silently gives up
 * on any failure along the way (no permission, no service worker --
 * next-pwa's own SW is disabled in development, see next.config.js --
 * unsupported browser, network error): push is an enhancement here, never
 * something sign-in or the Messages page should block on. Mirrors the
 * mobile app's own `registerForPushNotifications` (src/lib/notifications.ts)
 * in spirit, the two platforms' native APIs just differ.
 */
export async function registerWebPush(userId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) return;

    try {
        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        if (permission !== 'granted') return;

        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });
        }

        await upsertPushToken(userId, 'web', JSON.stringify(subscription));
    } catch {
        // Enhancement only -- see the function comment above.
    }
}
