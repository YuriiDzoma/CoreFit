'use client';
import React from "react";
import { usePathname } from "next/navigation";
import styles from './social.module.scss'
import FriendsMenu from "../components/friendsMenu/friendsMenu";
import SubTabs from "../components/subTabs/subTabs";
import AllFriends from "./friends/components/allFriends";
import UserList from "./users/components/userList";
import useWindowSize from "../hooks/useWindowSize";
import { useAppSelector } from "../hooks/redux";
import { getText } from "@/store/selectors";
import { useFriendRequestStore } from "@/store/useFriendRequestStore";
import { SocialColumnsContext } from "./socialColumns";

// At 1200+ (full sidebar) the Friends section is two columns, like Home
// (homeLayout.tsx): Friends | Requests behind their own switch on the left,
// All users always on the right. `/users` has no left page of its own, so
// it shows your Friends there; `/friends/[id]` (someone else's friends)
// stays on the left under the Friends tab. Below 1200 the three pages keep
// their own tabs.
export default function SocialLayout({ children }: { children: React.ReactNode }) {
    const { width } = useWindowSize();
    const pathname = usePathname();
    const { base } = useAppSelector(getText);
    const { requests } = useFriendRequestStore();

    // See homeLayout.tsx: nothing until the window has been measured.
    if (width === 0) return <div className={styles.social} />;

    if (width < 1200) {
        return (
            <div className={styles.social}>
                <div className={styles.menu}>
                    <FriendsMenu />
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        );
    }

    const onRequests = pathname === '/requests';

    return (
        <SocialColumnsContext.Provider value={true}>
            <div className={styles.columns}>
                <section className={styles.column}>
                    <div className={styles.columnTabs}>
                        <SubTabs
                            items={[
                                { key: 'friends', href: '/friends', label: base.friends, active: !onRequests },
                                {
                                    key: 'requests',
                                    href: '/requests',
                                    label: base.requests,
                                    active: onRequests,
                                    badge: requests.length,
                                },
                            ]}
                        />
                    </div>
                    <div className={styles.columnBody}>
                        {pathname === '/users' ? <AllFriends /> : children}
                    </div>
                </section>
                <aside className={styles.columnBody}>
                    <UserList />
                </aside>
            </div>
        </SocialColumnsContext.Provider>
    );
}
