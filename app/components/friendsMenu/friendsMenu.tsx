'use client';
import Link from "next/link";
import styles from "./friendsMenu.module.scss";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../hooks/redux";
import { getText } from "@/store/selectors";
import { useFriendRequestStore } from "@/store/useFriendRequestStore";
import useWindowSize from "../../hooks/useWindowSize";

const ITEM_DEFS = [
    {
        key: 'requests' as const,
        href: '/requests',
        isActive: (pathname: string) => pathname === '/requests',
    },
    {
        key: 'friends' as const,
        href: '/friends',
        isActive: (pathname: string) => pathname.startsWith('/friends'),
    },
    {
        key: 'users' as const,
        href: '/users',
        isActive: (pathname: string) => pathname === '/users',
    },
];

// Friends/Requests/Users' own floating glass pill bar — same structure and
// same narrow-only gating as `trainingMenu.tsx` (Complexes/Programs/Wiki):
// at desktop width, Navigation is an in-flow top tab row rather than a
// floating bottom bar, so a fixed-position pill here would float
// disconnected from the rest of the desktop chrome. Desktop keeps its
// existing entry points (allFriends.tsx's own banners, Navigation's
// top-level Users tab) instead of duplicating them here.
const FriendsMenu = () => {
    const { width } = useWindowSize();
    const pathname = usePathname();
    const { base } = useAppSelector(getText);
    const { requests } = useFriendRequestStore();

    if (width >= 768) return null;

    return (
        <div className={styles.floatingWrap}>
            <div className={styles.floatingBar}>
                {ITEM_DEFS.map((item) => {
                    const active = item.isActive(pathname);

                    return (
                        <Link key={item.key} href={item.href} className={styles.floatingItem}>
                            <span className={active ? styles.floatingPillActive : styles.floatingPill} />
                            <span className={active ? styles.labelActive : styles.label}>
                                {base[item.key]}
                                {item.key === 'requests' && requests.length > 0 && (
                                    <span className={styles.badge}>
                                        {requests.length > 99 ? '99+' : requests.length}
                                    </span>
                                )}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default FriendsMenu;
