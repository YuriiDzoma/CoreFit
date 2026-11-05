'use client'
import React, {useEffect, useMemo, useState} from "react";
import {useAppSelector} from "@/app/hooks/redux";
import { useParams } from "next/navigation";
import {getText, getUserId} from "@/store/selectors";
import Link from "next/link";
import Image from "next/image";
import styles from '../components/allFriends.module.scss'
import elevatedStyles from "../../../../ui/elevatedCard/elevatedCard.module.scss";
import {ProfileType} from "@/types/user";
import {fetchLimitedFriendProfiles} from "@/lib/userData";
import {getAllFriendsOfUser, removeFriendship} from "@/lib/friendData";
import {useFriendRequestStore} from "@/store/useFriendRequestStore";
import {FriendsListSkeleton} from "@/ui/skeleton/skeleton";
import Preloader from "@/ui/preloader/Preloader";
import {formatLastActive} from "@/lib/lastActive";
import {avatarFallbackUrl} from "@/lib/avatarFallback";
import {notifyFriendsChanged, onFriendsChanged} from "@/lib/friendsChanged";
import {useInSocialColumns} from "../../socialColumns";


const AllFriends = () => {
    const {base} = useAppSelector(getText);
    const currentUserId = useAppSelector(getUserId);
    const { id } = useParams();
    const [friends, setFriends] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPreloader, setIsPreloader] = useState(false);
    const { requests } = useFriendRequestStore();
    const inColumns = useInSocialColumns();

    // Bare `/friends` (no `[id]` segment -- reachable directly by URL even
    // though nothing in the app links to it that way, see navigation.tsx's
    // own `friendsHref` comment) has no subject of its own to fall back
    // to but the viewer's own id, same as the mobile app's own
    // `subjectId = paramUserId ?? user?.id`. Previously this just bailed
    // out of the fetch entirely without ever clearing `loading`, hanging
    // the skeleton forever instead of showing anything.
    const effectiveId = typeof id === 'string' ? id : currentUserId;
    const isOwnProfile = !!currentUserId && currentUserId === effectiveId;

    useEffect(() => {
        const fetchData = async () => {
            if (!effectiveId) {
                setLoading(false);
                return;
            }

            const friendLinks = await getAllFriendsOfUser(effectiveId);
            const friendIds = friendLinks.map(r =>
                r.user_id === effectiveId ? r.friend_id : r.user_id
            );

            const allFriends = await fetchLimitedFriendProfiles(friendIds, 100);
            setFriends(allFriends);
            setLoading(false);
        };
        fetchData();
        // A request accepted or a friend removed in the other column
        // (1200+, socialLayout.tsx).
        return onFriendsChanged(fetchData);
    }, [effectiveId]);

    // Own list only -- matches userList.tsx's own removeFriend, immediate
    // (no confirm dialog) so the two pages' remove actions behave, not
    // just look, the same.
    const removeFriend = async (friendId: string) => {
        setIsPreloader(true);
        const res = await removeFriendship(friendId);
        if (res) {
            setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
            notifyFriendsChanged();
        }
        setIsPreloader(false);
    };

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const filteredFriends = useMemo(
        () =>
            trimmedQuery
                ? friends.filter((friend) => (friend.username ?? '').toLowerCase().includes(trimmedQuery))
                : friends,
        [friends, trimmedQuery],
    );

    return (
        <div className={`${styles.allFriends} ${inColumns ? styles.inColumns : ''}`}>
            {!inColumns && <h2 className={'pageTitle'}>{base.friends}</h2>}

            {/* Discoverability path to /users -- previously reachable only
                via the bottom nav's Users tab. Own-profile only, same
                reasoning as the requests banner below: browsing to add new
                friends doesn't belong on someone else's Friends page. */}
            {isOwnProfile && !inColumns && (
                <Link href="/users" className={styles.requestsBanner}>
                    <span>{base.browseUsers}</span>
                    <span>›</span>
                </Link>
            )}

            {/* Requests has no nav entry point of its own now that the
                primary bar's Friends badge is a count only (not a link) —
                this is the one path back to it, shown only on your own
                Friends page and only when there's something to act on. */}
            {isOwnProfile && !inColumns && requests.length > 0 && (
                <Link href="/requests" className={styles.requestsBanner}>
                    <span>{base.friendRequestsLabel.replace('{value}', requests.length > 99 ? '99+' : String(requests.length))}</span>
                    <span>›</span>
                </Link>
            )}

            {loading ? (
                <FriendsListSkeleton oneColumn={inColumns}/>
            ) : (
                <>
                    {friends.length > 0 && (
                        <div className={styles.searchRow}>
                            <input
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder={base.searchFriends}
                                type="search"
                            />
                            {searchQuery.length > 0 && (
                                <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
                                    ✕
                                </button>
                            )}
                        </div>
                    )}

                    {friends.length === 0 ? (
                        <p>{isOwnProfile ? base.noFriendsOwn : base.noFriendsOther}</p>
                    ) : trimmedQuery && filteredFriends.length === 0 ? (
                        <p>{base.noFriendsMatch.replace('{value}', searchQuery.trim())}</p>
                    ) : (
                        <ul className={`${styles.friendList} ${inColumns ? styles.oneColumn : ''}`}>
                            {filteredFriends.map(friend => {
                                const isOnline = formatLastActive(friend.last_active_at)?.isOnline ?? false;

                                return (
                                <li key={friend.id} className={`${styles.friendList__item} ${elevatedStyles.elevated}`}>
                                    <Link
                                        href={`/profile/${friend.id}`}
                                        className={styles.friendList__link}
                                    >
                                        <div className={styles.avatarWrap}>
                                            <Image
                                                src={friend.avatar_url || avatarFallbackUrl(friend.username)}
                                                width={34}
                                                height={34}
                                                alt={friend.username}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = avatarFallbackUrl(friend.username);
                                                }}
                                            />
                                            {isOnline && <span className={styles.onlineDot}/>}
                                        </div>
                                        <span className={styles.friendList__name}>{friend.username}</span>
                                    </Link>

                                    {isOwnProfile && (
                                        <button
                                            className={`${styles.friendList__btn} button`}
                                            onClick={() => removeFriend(friend.id)}
                                        >
                                            <span>{base.removeFriend}</span>
                                        </button>
                                    )}
                                </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
            {isPreloader && <Preloader/>}
        </div>
    )
}

export default AllFriends;