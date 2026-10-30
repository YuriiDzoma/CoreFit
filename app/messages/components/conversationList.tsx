'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/hooks/redux';
import { getText, getUserId } from '@/store/selectors';
import { useMessagesStore, isUnreadEntry, ConversationWithProfile } from '@/store/useMessagesStore';
import { clearConversationForMe, deleteConversationForEveryone } from '@/lib/messagesData';
import { useLongPress } from '@/app/hooks/useLongPress';
import GlobalPopup from '@/app/components/globalPopup/globalPopup';
import { formatConversationTime } from '@/lib/formatMessageTime';
import { avatarFallbackUrl } from '@/lib/avatarFallback';
import { MessagesListSkeleton } from '@/ui/skeleton/skeleton';
import elevatedStyles from '@/ui/elevatedCard/elevatedCard.module.scss';
import styles from './conversationList.module.scss';
import { formatLastActive } from '@/lib/lastActive';

function ConversationRow({
    entry,
    userId,
    unread,
    onLongPress,
}: {
    entry: ConversationWithProfile;
    userId: string;
    unread: boolean;
    onLongPress: () => void;
}) {
    const longPress = useLongPress(onLongPress);
    const { base } = useAppSelector(getText);
    const { conversation, otherProfile } = entry;
    const name = otherProfile?.username ?? base.unknownUser;
    const isOnline = formatLastActive(otherProfile?.last_active_at)?.isOnline ?? false;

    const preview = conversation.last_message_body
        ? conversation.last_message_sender_id === userId
            ? base.messagesFromYou.replace('{value}', conversation.last_message_body)
            : conversation.last_message_body
        : base.messagesNoPreview;

    return (
        <li className={elevatedStyles.elevated}>
            <Link href={`/messages/${conversation.id}`} className={styles.row} {...longPress}>
                <span className={styles.avatarWrap}>
                    <Image
                        src={otherProfile?.avatar_url || avatarFallbackUrl(name)}
                        width={48}
                        height={48}
                        alt={name}
                        className={styles.avatar}
                    />
                    {isOnline && <span className={styles.onlineDot} />}
                </span>
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
    const { conversations, readMarkers, loading, subscribeToRealtime, removeConversation } = useMessagesStore();

    const [pendingDelete, setPendingDelete] = useState<ConversationWithProfile | null>(null);
    const [alsoForOther, setAlsoForOther] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const openDeleteDialog = (entry: ConversationWithProfile) => {
        setPendingDelete(entry);
        setAlsoForOther(false);
        setDeleteError(false);
    };

    // Telegram's choice: unchecked clears the chat for me only (it comes
    // back with the next message); checked deletes it for both.
    const handleConfirmDelete = async () => {
        if (!pendingDelete || !userId) return;
        const conversationId = pendingDelete.conversation.id;
        const ok = alsoForOther
            ? await deleteConversationForEveryone(conversationId)
            : await clearConversationForMe(conversationId, userId);
        if (ok) removeConversation(conversationId);
        setDeleteError(!ok);
        setPendingDelete(null);
    };

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
                <MessagesListSkeleton />
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
                                onLongPress={() => openDeleteDialog(entry)}
                            />
                        ))}
                </ul>
            )}

            {deleteError && <p className={styles.error}>❌ {base.chatDeleteFailed}</p>}

            {pendingDelete && (
                <GlobalPopup
                    title={base.deleteChatTitle}
                    message={alsoForOther ? base.deleteChatBodyBoth : base.deleteChatBodyMe}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setPendingDelete(null)}
                >
                    <label className={styles.deleteOption}>
                        <input
                            type="checkbox"
                            checked={alsoForOther}
                            onChange={() => setAlsoForOther((value) => !value)}
                        />
                        <span>
                            {base.deleteChatAlsoFor.replace(
                                '{value}',
                                pendingDelete.otherProfile?.username ?? base.unknownUser
                            )}
                        </span>
                    </label>
                </GlobalPopup>
            )}
        </div>
    );
}
