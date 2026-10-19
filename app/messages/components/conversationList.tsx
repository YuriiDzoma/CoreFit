'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/hooks/redux';
import { getText, getUserId } from '@/store/selectors';
import { useMessagesStore, isUnreadEntry, ConversationWithProfile } from '@/store/useMessagesStore';
import { formatConversationTime } from '@/lib/formatMessageTime';
import { avatarFallbackUrl } from '@/lib/avatarFallback';
import { UsersSkeleton } from '@/ui/skeleton/skeleton';
import elevatedStyles from '@/ui/elevatedCard/elevatedCard.module.scss';
import styles from './conversationList.module.scss';

function ConversationRow({
    entry,
    userId,
    unread,
}: {
    entry: ConversationWithProfile;
    userId: string;
    unread: boolean;
}) {
    const { base } = useAppSelector(getText);
    const { conversation, otherProfile } = entry;
    const name = otherProfile?.username ?? base.unknownUser;

    const preview = conversation.last_message_body
        ? conversation.last_message_sender_id === userId
            ? base.messagesFromYou.replace('{value}', conversation.last_message_body)
            : conversation.last_message_body
        : base.messagesNoPreview;

    return (
        <li className={elevatedStyles.elevated}>
            <Link href={`/messages/${conversation.id}`} className={styles.row}>
                <Image
                    src={otherProfile?.avatar_url || avatarFallbackUrl(name)}
                    width={48}
                    height={48}
                    alt={name}
                    className={styles.avatar}
                />
                <div className={styles.textCol}>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.preview}>{preview}</p>
                </div>
                <div className={styles.metaCol}>
                    {conversation.last_message_at && (
                        <span className={styles.time}>{formatConversationTime(conversation.last_message_at)}</span>
                    )}
                    {unread && <span className={styles.unreadDot} />}
                </div>
            </Link>
        </li>
    );
}

export default function ConversationList() {
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);
    const { conversations, readMarkers, loading, subscribeToRealtime } = useMessagesStore();

    // The realtime subscription is also opened app-wide from header.tsx (so
    // the nav badge stays live on every page) -- this call is idempotent
    // from this screen's point of view (re-subscribing just re-fetches),
    // and guarantees the list is fresh even if this page is the very first
    // thing to mount after sign-in.
    useEffect(() => {
        if (userId) subscribeToRealtime(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
        <div className={styles.messages}>
            <h2 className="pageTitle">{base.messages}</h2>

            <Link href="/messages/new" className={`${styles.newButton} submit`}>
                <span>{base.newMessage}</span>
            </Link>

            {loading ? (
                <UsersSkeleton />
            ) : conversations.length === 0 ? (
                <p className={styles.empty}>{base.noConversationsYet}</p>
            ) : (
                <ul>
                    {userId &&
                        conversations.map((entry) => (
                            <ConversationRow
                                key={entry.conversation.id}
                                entry={entry}
                                userId={userId}
                                unread={isUnreadEntry(entry, userId, readMarkers)}
                            />
                        ))}
                </ul>
            )}
        </div>
    );
}
