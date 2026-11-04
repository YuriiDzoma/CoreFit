'use client';
import styles from './navigation.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { House, Users, Dumbbell, MessageSquareText, Settings, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import useWindowSize from "../../hooks/useWindowSize";
import { useAppSelector } from "../../hooks/redux";
import { getUserId, getText, getIsDarkTheme } from "@/store/selectors";
import { useFriendRequestStore } from "@/store/useFriendRequestStore";
import { useMessagesStore, selectUnreadCount } from "@/store/useMessagesStore";
import { fetchUserProfileById } from "../../../lib/userData";
import type { ProfileType } from "@/types/user";

// Same cut-off every `max-width: 768px` media query here uses -- 768
// itself is still the floating-glass mobile layout, the sidebar starts at
// 769.
const MOBILE_BREAKPOINT = 768;
const ICON_SIZE = 24;

const Navigation = () => {
    const pathname = usePathname();
    const { width } = useWindowSize();

    if (width && width <= MOBILE_BREAKPOINT) {
        return <FloatingNavigation pathname={pathname} />;
    }

    return <Sidebar pathname={pathname} />;
};

// Everything both navigation shapes (floating bar, desktop sidebar) read
// -- which item is active, where Friends points, badge counts, the
// signed-in user's avatar -- so the IA itself only exists in one place.
const useNavState = (pathname: string) => {
    const userId = useAppSelector(getUserId);
    const { requests } = useFriendRequestStore();
    const { conversations, readMarkers } = useMessagesStore();
    const unreadMessages = userId ? selectUnreadCount(conversations, readMarkers, userId) : 0;
    const [profile, setProfile] = useState<ProfileType | null>(null);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        fetchUserProfileById(userId).then((result) => {
            if (!cancelled) setProfile(result);
        });
        return () => {
            cancelled = true;
        };
    }, [userId]);

    // `/friends` (bare, no id) isn't a route anything else in this app
    // links to — `AllFriends` reads its subject from the `[id]` param, so
    // the only shape that actually renders own-friends content is
    // `/friends/{id}`, matching `Friends.tsx`'s own "See all friends" link.
    const friendsHref = userId ? `/friends/${userId}` : '/friends';

    return {
        // Records and News are Home's own sub-tabs (homeMenu), next to Trainings.
        isHomeActive: pathname === '/' || pathname === '/records' || pathname === '/news',
        // Requests and Users are the Friends tab's own sub-tabs (friendsMenu),
        // so all three light up the Friends icon.
        isFriendsActive:
            pathname.startsWith('/friends') || pathname === '/requests' || pathname === '/users',
        isTrainingActive: pathname.startsWith('/training'),
        isMessagesActive: pathname.startsWith('/messages'),
        isProfileActive: pathname === '/profile',
        isSettingsActive: pathname === '/settings',
        friendsHref,
        requestCount: requests.length,
        unreadMessages,
        avatarUrl: profile?.avatar_url ?? null,
        username: profile?.username ?? '',
    };
};

const formatBadge = (count: number) => (count > 99 ? '99+' : count);

// Desktop/tablet (>768px) navigation, replacing the old in-flow
// folder-tab row. One component, two widths: 769-1199 is a narrow icon
// rail (labels shrink under each icon, the CTA collapses to its icon),
// 1200+ the full labelled sidebar -- purely a CSS switch
// (navigation.module.scss), so nothing re-renders on resize. Same four
// destinations as FloatingNavigation, plus Settings, which the floating
// layout reaches through Header's own Menu instead -- Header itself isn't
// shown at this width while signed in (app.module.scss `.withSidebar`).
const Sidebar = ({ pathname }: { pathname: string }) => {
    const { base } = useAppSelector(getText);
    const isDark = useAppSelector(getIsDarkTheme);
    const nav = useNavState(pathname);

    const items = [
        { href: '/', label: base.home, Icon: House, active: nav.isHomeActive, badge: 0 },
        { href: nav.friendsHref, label: base.friends, Icon: Users, active: nav.isFriendsActive, badge: nav.requestCount },
        { href: '/training', label: base.training, Icon: Dumbbell, active: nav.isTrainingActive, badge: 0 },
        { href: '/messages', label: base.messages, Icon: MessageSquareText, active: nav.isMessagesActive, badge: nav.unreadMessages },
    ];

    return (
        <aside className={styles.sidebar}>
            <Link href="/" className={styles.sidebarLogo}>
                <Image
                    src={isDark ? '/logos/logo.png' : '/logos/logo-white.png'}
                    width={40}
                    height={40}
                    alt="logo"
                />
                <span>COREFIT</span>
            </Link>

            <nav className={styles.sidebarNav}>
                {items.map(({ href, label, Icon, active, badge }) => (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={active ? styles.sidebarItemActive : styles.sidebarItem}
                    >
                        <span className={styles.badgeAnchor}>
                            <Icon size={ICON_SIZE} strokeWidth={1.8} />
                            {badge > 0 && <span className={styles.badge}>{formatBadge(badge)}</span>}
                        </span>
                        <span className={styles.sidebarLabel}>{label}</span>
                    </Link>
                ))}
            </nav>

            <Link href="/training" className={styles.sidebarCta} aria-label={base.startTraining}>
                <Play size={20} strokeWidth={2} />
                <span className={styles.sidebarCtaLabel}>{base.startTraining}</span>
            </Link>

            <div className={styles.sidebarBottom}>
                <Link
                    href="/settings"
                    aria-current={nav.isSettingsActive ? 'page' : undefined}
                    className={nav.isSettingsActive ? styles.sidebarItemActive : styles.sidebarItem}
                >
                    <Settings size={ICON_SIZE} strokeWidth={1.8} />
                    <span className={styles.sidebarLabel}>{base.settings}</span>
                </Link>

                <Link
                    href="/profile"
                    aria-current={nav.isProfileActive ? 'page' : undefined}
                    className={nav.isProfileActive ? styles.userCardActive : styles.userCard}
                >
                    <Image
                        src={nav.avatarUrl || '/avatar-placeholder.png'}
                        alt={base.profile}
                        width={40}
                        height={40}
                        className={styles.userAvatar}
                    />
                    <span className={styles.userText}>
                        <span className={styles.userName}>{nav.username}</span>
                        <span className={styles.userHint}>{base.profile}</span>
                    </span>
                </Link>
            </div>
        </aside>
    );
};

// Instagram/Threads-style floating glass bar — the Web Mobile (<=768px)
// equivalent of React Native's `components/navigation.tsx`. Same five
// destinations, same active language, same "no labels" presentation.
const FloatingNavigation = ({ pathname }: { pathname: string }) => {
    const nav = useNavState(pathname);
    // Floating layout keeps Settings under Header's Menu, so it lights up
    // the profile avatar here rather than an item of its own.
    const isProfileActive = nav.isProfileActive || nav.isSettingsActive;
    // Exact match here (a thread page isn't lit), unlike the sidebar.
    const isMessagesActive = pathname === '/messages';

    return (
        <div className={styles.floatingWrap}>
            <div className={styles.floatingBar}>
                <Link href="/" className={styles.floatingItem}>
                    <span className={nav.isHomeActive ? styles.floatingPillActive : styles.floatingPill} />
                    <House
                        size={ICON_SIZE}
                        strokeWidth={2}
                        className={nav.isHomeActive ? styles.iconActive : styles.icon}
                    />
                </Link>

                <Link href={nav.friendsHref} className={styles.floatingItem}>
                    <span className={nav.isFriendsActive ? styles.floatingPillActive : styles.floatingPill} />
                    <span className={styles.badgeAnchor}>
                        <Users
                            size={ICON_SIZE}
                            strokeWidth={2}
                            className={nav.isFriendsActive ? styles.iconActive : styles.icon}
                        />
                        {nav.requestCount > 0 && (
                            <span className={styles.badge}>{formatBadge(nav.requestCount)}</span>
                        )}
                    </span>
                </Link>

                <Link href="/training" className={styles.floatingItem}>
                    <span className={nav.isTrainingActive ? styles.floatingPillActive : styles.floatingPill} />
                    <Dumbbell
                        size={ICON_SIZE}
                        strokeWidth={2}
                        className={nav.isTrainingActive ? styles.iconActive : styles.icon}
                    />
                </Link>

                <Link href="/messages" className={styles.floatingItem}>
                    <span className={isMessagesActive ? styles.floatingPillActive : styles.floatingPill} />
                    <span className={styles.badgeAnchor}>
                        <MessageSquareText
                            size={ICON_SIZE}
                            strokeWidth={2}
                            className={isMessagesActive ? styles.iconActive : styles.icon}
                        />
                        {nav.unreadMessages > 0 && (
                            <span className={styles.badge}>{formatBadge(nav.unreadMessages)}</span>
                        )}
                    </span>
                </Link>

                <Link href="/profile" className={styles.floatingItem}>
                    <span className={isProfileActive ? styles.floatingPillActive : styles.floatingPill} />
                    <span className={isProfileActive ? styles.avatarRingActive : styles.avatarRing}>
                        <Image
                            src={nav.avatarUrl || '/avatar-placeholder.png'}
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
