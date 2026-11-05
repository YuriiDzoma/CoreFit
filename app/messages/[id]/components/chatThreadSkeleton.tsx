import styles from './chatThread.module.scss';

// Alternating sides and uneven widths, newest at the bottom.
const BUBBLES = [
    { own: false, width: '45%', height: 44 },
    { own: true, width: '32%', height: 44 },
    { own: false, width: '58%', height: 64 },
    { own: true, width: '40%', height: 44 },
    { own: true, width: '24%', height: 44 },
];

// The conversation's loading placeholder, with the loaded thread's exact
// layout (contact row, bubbles, input row) so a slow connection reads as
// loading, not as an empty chat. Shown twice over: by the route's
// loading.tsx while the page's code itself is still arriving, then by
// ChatThread while it fetches the conversation. Mirrors mobile's
// ChatSkeleton.
export default function ChatThreadSkeleton() {
    return (
        <div className={styles.thread} aria-busy="true">
            <div className={styles.contactRow}>
                <span className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
                <div className={styles.skeletonText}>
                    <span className={`${styles.skeleton} ${styles.skeletonName}`} />
                    <span className={`${styles.skeleton} ${styles.skeletonStatus}`} />
                </div>
            </div>
            <div className={styles.messagesList}>
                {BUBBLES.map((bubble, index) => (
                    <div key={index} className={bubble.own ? styles.skeletonRowOwn : styles.skeletonRow}>
                        <span
                            className={`${styles.skeleton} ${bubble.own ? styles.skeletonBubbleOwn : styles.skeletonBubble}`}
                            style={{ width: bubble.width, height: bubble.height }}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.inputRow}>
                <span className={`${styles.skeleton} ${styles.skeletonInput}`} />
                <span className={`${styles.skeleton} ${styles.skeletonSend}`} />
            </div>
        </div>
    );
}
