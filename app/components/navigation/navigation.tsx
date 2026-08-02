'use client';
import styles from './navigation.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { House, Users, Dumbbell, MessageSquareText } from 'lucide-react';
import { useEffect, useState } from 'react';
import useWindowSize from "../../hooks/useWindowSize";
import { useAppSelector } from "../../hooks/redux";
import { getUserId } from "@/store/selectors";
import { useFriendRequestStore } from "@/store/useFriendRequestStore";
import { fetchUserProfileById } from "../../../lib/userData";

const MOBILE_BREAKPOINT = 768;
const ICON_SIZE = 24;

const Navigation = () => {
    const pathname = usePathname();
    const { width } = useWindowSize();

    if (width && width < MOBILE_BREAKPOINT) {
        return <FloatingNavigation pathname={pathname} />;
    }

    const isActive = (route: string) => pathname.startsWith(`${route}/`) || pathname === route;

    return (
        <div className={styles.navigation}>
            <Link
                href="/profile"
                className={pathname === '/profile' ? `${styles.link} ${styles.active}` : styles.link}
            >
                <span>Profile</span>
            </Link>

            <Link
                href="/training"
                className={`${styles.link} ${isActive('/training') ? styles.active : ''}`}
            >
                <span>Training</span>
            </Link>

            <Link
                href="/users"
                className={pathname === '/users' ? `${styles.link} ${styles.active}` : styles.link}
            >
                <span>Users</span>
            </Link>
        </div>
    );
};

// Instagram/Threads-style floating glass bar — the Web Mobile (<768px)
// equivalent of React Native's `components/navigation.tsx`. Same five
// destinations, same active language, same "no labels" presentation — kept
// in this file (branching on width, like `header.tsx` already does for
// `Menu`/`HeaderNavigation`) rather than a separate component, so the IA
// itself (which five items, what each one points to) only exists in one
// place.
const FloatingNavigation = ({ pathname }: { pathname: string }) => {
    const userId = useAppSelector(getUserId);
    const { requests } = useFriendRequestStore();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        fetchUserProfileById(userId).then((profile) => {
            if (!cancelled) setAvatarUrl(profile?.avatar_url ?? null);
        });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    const isProfileActive = pathname === '/profile' || pathname === '/settings';
    const isTrainingActive = pathname.startsWith('/training');
    const isFriendsActive = pathname.startsWith('/friends');
    const isMessagesActive = pathname === '/messages';
    const isHomeActive = pathname === '/';
    // `/friends` (bare, no id) isn't a route anything else in this app
    // links to — `AllFriends` reads its subject from the `[id]` param, so
    // the only shape that actually renders own-friends content is
    // `/friends/{id}`, matching `Friends.tsx`'s own "See all friends" link.
    const friendsHref = userId ? `/friends/${userId}` : '/friends';

    return (
        <div className={styles.floatingWrap}>
            <div className={styles.floatingBar}>
                <Link href="/" className={styles.floatingItem}>
                    <span className={isHomeActive ? styles.floatingPillActive : styles.floatingPill} />
                    <House
                        size={ICON_SIZE}
                        strokeWidth={2}
                        className={isHomeActive ? styles.iconActive : styles.icon}
                    />
                </Link>

                <Link href={friendsHref} className={styles.floatingItem}>
                    <span className={isFriendsActive ? styles.floatingPillActive : styles.floatingPill} />
                    <span className={styles.badgeAnchor}>
                        <Users
                            size={ICON_SIZE}
                            strokeWidth={2}
                            className={isFriendsActive ? styles.iconActive : styles.icon}
                        />
                        {requests.length > 0 && (
                            <span className={styles.badge}>
                                {requests.length > 99 ? '99+' : requests.length}
                            </span>
                        )}
                    </span>
                </Link>

                <Link href="/training" className={styles.floatingItem}>
                    <span className={isTrainingActive ? styles.floatingPillActive : styles.floatingPill} />
                    <Dumbbell
                        size={ICON_SIZE}
                        strokeWidth={2}
                        className={isTrainingActive ? styles.iconActive : styles.icon}
                    />
                </Link>

                <Link href="/messages" className={styles.floatingItem}>
                    <span className={isMessagesActive ? styles.floatingPillActive : styles.floatingPill} />
                    {/* Not yet built — stays at the same weight every
                        *inactive* icon already has (plain `.icon`, never
                        `.iconActive`), rather than a separate, extra-muted
                        tone that read as a thinner icon family.
                        MessageSquareText (internal text lines) matches the
                        others' optical density; MessageCircle's bare
                        outline didn't. */}
                    <MessageSquareText size={ICON_SIZE} strokeWidth={2} className={styles.icon} />
                </Link>

                <Link href="/profile" className={styles.floatingItem}>
                    <span className={isProfileActive ? styles.floatingPillActive : styles.floatingPill} />
                    <span className={isProfileActive ? styles.avatarRingActive : styles.avatarRing}>
                        <Image
                            src={avatarUrl || '/avatar-placeholder.png'}
                            alt="Profile"
                            width={26}
                            height={26}
                            className={styles.avatarImg}
                        />
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Navigation;
