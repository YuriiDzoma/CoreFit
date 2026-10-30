'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Check, Pencil, Send, X } from 'lucide-react';
import { useAppSelector } from '@/app/hooks/redux';
import { getText, getUserId } from '@/store/selectors';
import { useMessagesStore } from '@/store/useMessagesStore';
import {
    deleteMessageForEveryone,
    editMessage,
    getConversationById,
    getMessages,
    hideMessageForMe,
    markConversationRead,
    MESSAGES_PAGE_SIZE,
    otherParticipantId,
    sendMessage,
} from '@/lib/messagesData';
import { fetchUserProfileById } from '@/lib/userData';
import { formatLastActive } from '@/lib/lastActive';
import { formatDateDivider } from '@/lib/formatMessageTime';
import { avatarFallbackUrl } from '@/lib/avatarFallback';
import { createClient } from '@/utils/supabase/client';
import { Conversation, Message } from '@/types/messages';
import { ProfileType } from '@/types/user';
import ActionMenu, { ActionMenuItem } from '@/app/components/actionMenu/actionMenu';
import MessageBubble from './messageBubble';
import styles from './chatThread.module.scss';

type LoadState =
    | { state: 'loading' }
    | { state: 'success'; conversation: Conversation; otherProfile: ProfileType | null }
    | { state: 'not-found' };

export default function ChatThread() {
    const params = useParams<{ id: string }>();
    const conversationId = params.id;
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);
    const markReadInStore = useMessagesStore((state) => state.markRead);

    const [loadState, setLoadState] = useState<LoadState>({ state: 'loading' });
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const [actionMessage, setActionMessage] = useState<Message | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    // Telegram-style edit mode: the input holds the message's text and Send
    // saves it in place instead of posting a new one.
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);

    useEffect(() => {
        if (!conversationId || !userId) return;
        let cancelled = false;

        (async () => {
            const conversation = await getConversationById(conversationId);
            if (cancelled) return;
            if (!conversation) {
                setLoadState({ state: 'not-found' });
                return;
            }
            const otherId = otherParticipantId(conversation, userId);
            const [otherProfile, page] = await Promise.all([
                fetchUserProfileById(otherId),
                getMessages(conversationId),
            ]);
            if (cancelled) return;
            setLoadState({ state: 'success', conversation, otherProfile });
            // `getMessages` returns newest-first (it pages "load older"
            // from the end, same contract as mobile's own inverted-list
            // version) -- this component renders chronologically
            // top-to-bottom, so the initial page needs reversing into
            // oldest-first before it lands in state. `handleLoadMore`
            // below already does this for every later page; this was the
            // one spot still assigning the raw (newest-first) page
            // directly, which put the newest message near the *top* of
            // the thread instead of the bottom.
            setMessages(page.slice().reverse());
            setHasMore(page.length === MESSAGES_PAGE_SIZE);
            markConversationRead(conversationId, userId).then(() => markReadInStore(conversationId));
        })();

        const supabase = createClient();
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const row = payload.new as Message;
                    setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
                    if (row.sender_id !== userId) {
                        markConversationRead(conversationId, userId).then(() => markReadInStore(conversationId));
                    }
                }
            )
            // An edit (either side): swap the row in place. UPDATE payloads
            // carry the full new row and are filterable like INSERT.
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const row = payload.new as Message;
                    setMessages((prev) => prev.map((m) => (m.id === row.id ? row : m)));
                }
            )
            // The other participant's "delete for everyone". DELETE events
            // can't be filtered server-side and carry only the id, so
            // they're matched against what's loaded here.
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
                const deletedId = (payload.old as { id?: string }).id;
                if (deletedId) setMessages((prev) => prev.filter((m) => m.id !== deletedId));
            })
            // The other participant deleted the whole chat for both.
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'conversations' }, (payload) => {
                if ((payload.old as { id?: string }).id !== conversationId) return;
                useMessagesStore.getState().removeConversation(conversationId);
                setLoadState({ state: 'not-found' });
            })
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [conversationId, userId, markReadInStore]);

    // Keeps the thread pinned to the newest message on load and whenever a
    // new one arrives (sent or received) -- messages are appended in
    // chronological order (oldest first) here, unlike mobile's own
    // inverted-FlatList approach, since a plain scrollable div is the
    // idiomatic web equivalent.
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, [messages.length]);

    const handleLoadMore = async () => {
        if (!conversationId || loadingMore || !hasMore || messages.length === 0) return;
        setLoadingMore(true);
        const oldest = messages[0];
        const container = listRef.current;
        const previousScrollHeight = container?.scrollHeight ?? 0;
        const page = await getMessages(conversationId, oldest.created_at);
        setMessages((prev) => [...page.slice().reverse(), ...prev]);
        setHasMore(page.length === MESSAGES_PAGE_SIZE);
        setLoadingMore(false);
        // Keeps the viewport anchored on the message the user was looking
        // at rather than jumping to the top of the newly-prepended page.
        requestAnimationFrame(() => {
            if (container) container.scrollTop = container.scrollHeight - previousScrollHeight;
        });
    };

    const exitEdit = () => {
        setEditingMessage(null);
        setInputText('');
    };

    const handleSend = async () => {
        const body = inputText.trim();
        if (!body || !conversationId || !userId || sending) return;
        if (editingMessage) {
            if (body === editingMessage.body) {
                exitEdit();
                return;
            }
            setSending(true);
            const updated = await editMessage(editingMessage.id, body);
            if (updated) {
                setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
                exitEdit();
            }
            setSending(false);
            return;
        }
        setSending(true);
        const message = await sendMessage(conversationId, userId, body);
        if (message) {
            setInputText('');
            setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
        }
        setSending(false);
    };

    const closeActions = () => {
        setActionMessage(null);
        setActionError(null);
    };

    // Removed locally on success; for "for everyone" the realtime DELETE
    // echo is then a no-op filter.
    const runMessageAction = async (action: (message: Message) => Promise<boolean>) => {
        const target = actionMessage;
        if (!target) return;
        setActionError(null);
        if (await action(target)) {
            setMessages((prev) => prev.filter((m) => m.id !== target.id));
            if (editingMessage?.id === target.id) exitEdit();
            closeActions();
        } else {
            setActionError(`❌ ${base.messageDeleteFailed}`);
        }
    };

    const actionItems: ActionMenuItem[] = [];
    if (actionMessage && userId) {
        if (actionMessage.sender_id === userId) {
            const target = actionMessage;
            actionItems.push({
                key: 'edit',
                label: base.editMessage,
                onClick: () => {
                    setEditingMessage(target);
                    setInputText(target.body);
                    closeActions();
                },
            });
            actionItems.push({
                key: 'everyone',
                label: base.deleteForEveryone,
                destructive: true,
                onClick: () => runMessageAction((m) => deleteMessageForEveryone(m.id)),
            });
        }
        actionItems.push(
            {
                key: 'me',
                label: base.deleteForMe,
                destructive: true,
                onClick: () => runMessageAction((m) => hideMessageForMe(m.id, userId)),
            },
            { key: 'cancel', label: base.cancelAction, onClick: closeActions }
        );
    }

    if (loadState.state === 'loading') return null;
    if (loadState.state === 'not-found') {
        return (
            <div className={styles.notFound}>
                <p>{base.conversationNotFound}</p>
                <Link href="/messages">{base.backToMessages}</Link>
            </div>
        );
    }

    const { otherProfile } = loadState;
    const name = otherProfile?.username ?? base.unknownUser;
    const lastActive = formatLastActive(otherProfile?.last_active_at ?? null);

    return (
        <div className={styles.thread}>
            <div className={styles.contactRow}>
                <span className={styles.avatarWrap}>
                    <Image
                        src={otherProfile?.avatar_url || avatarFallbackUrl(name)}
                        width={36}
                        height={36}
                        alt={name}
                        className={styles.avatar}
                    />
                    {lastActive?.isOnline && <span className={styles.onlineDot} />}
                </span>
                <div>
                    <p className={styles.name}>{name}</p>
                    {lastActive && (
                        <p className={lastActive.isOnline ? styles.online : styles.lastSeen}>{lastActive.text}</p>
                    )}
                </div>
            </div>

            <div className={styles.messagesList} ref={listRef} onScroll={(e) => {
                if (e.currentTarget.scrollTop < 40) handleLoadMore();
            }}>
                {messages.length === 0 ? (
                    <p className={styles.empty}>{base.noMessagesYet}</p>
                ) : (
                    messages.map((message, index) => {
                        const previous = messages[index - 1];
                        const showDivider =
                            !previous ||
                            new Date(previous.created_at).toDateString() !== new Date(message.created_at).toDateString();
                        return (
                            <React.Fragment key={message.id}>
                                {showDivider && (
                                    <p className={styles.divider}>{formatDateDivider(message.created_at)}</p>
                                )}
                                <MessageBubble
                                    message={message}
                                    isOwn={message.sender_id === userId}
                                    onLongPress={() => setActionMessage(message)}
                                />
                            </React.Fragment>
                        );
                    })
                )}
            </div>

            {editingMessage && (
                <div className={styles.editBanner}>
                    <Pencil size={18} aria-hidden />
                    <div className={styles.editBanner__text}>
                        <p className={styles.editBanner__title}>{base.editingMessage}</p>
                        <p className={styles.editBanner__body}>{editingMessage.body}</p>
                    </div>
                    <button className={styles.editBanner__close} onClick={exitEdit} aria-label={base.cancelEditMessage}>
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className={styles.inputRow}>
                <textarea
                    className={styles.input}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={base.messageInputPlaceholder}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={sending || inputText.trim().length === 0}
                >
                    {editingMessage ? <Check size={18} color="#fff" /> : <Send size={18} color="#fff" />}
                </button>
            </div>

            {actionMessage && <ActionMenu items={actionItems} error={actionError} onClose={closeActions} />}
        </div>
    );
}
