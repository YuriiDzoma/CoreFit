import React from "react";
import styles from './social.module.scss'
import FriendsMenu from "../components/friendsMenu/friendsMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
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
