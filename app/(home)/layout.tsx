import React from "react";
import styles from './home.module.scss'
import HomeMenu from "../components/homeMenu/homeMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.home}>
            <div className={styles.menu}>
                <HomeMenu />
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
