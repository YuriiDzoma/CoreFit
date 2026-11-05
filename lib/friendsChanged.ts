// The web Friends section at 1200+ shows Friends/Requests beside All users
// (app/(social)/socialLayout.tsx), each list with its own state -- an
// accept or a remove in one has to reach the other, or it keeps showing
// "Add to friends" / a removed friend until reload.
const EVENT = 'corefit:friends-changed';

export function notifyFriendsChanged(): void {
    window.dispatchEvent(new Event(EVENT));
}

export function onFriendsChanged(handler: () => void): () => void {
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
}
