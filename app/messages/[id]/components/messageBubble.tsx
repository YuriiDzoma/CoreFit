import React from 'react';
import { formatBubbleTime } from '@/lib/formatMessageTime';
import { Message } from '@/types/messages';
import { useLongPress } from '@/app/hooks/useLongPress';
import styles from './messageBubble.module.scss';

// "Our colors", not a new brand accent: the own-message fill is
// `--border-color` (#204879), the same navy used everywhere else in this
// app as its signature accent -- filling it in here gives the own/other
// contrast Telegram's blue-vs-grey bubbles have, without inventing a
// color this app doesn't already use elsewhere. The other participant's
// bubble reuses `--elevated-bg`, the same "lifted surface" tone
// `elevatedCard.module.scss` uses throughout the rest of the app. Matches
// the mobile app's own `MessageBubble` component exactly.
// `onLongPress` opens the delete menu -- long press on touch, right click on
// desktop, as in Telegram/Viber.
export default function MessageBubble({
    message,
    isOwn,
    onLongPress,
}: {
    message: Message;
    isOwn: boolean;
    onLongPress?: () => void;
}) {
    const longPress = useLongPress(onLongPress);
    return (
        <div className={`${styles.row} ${isOwn ? styles.rowOwn : styles.rowOther}`}>
            <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`} {...longPress}>
                <p className={styles.body}>{message.body}</p>
                <span className={styles.time}>{formatBubbleTime(message.created_at)}</span>
            </div>
        </div>
    );
}
