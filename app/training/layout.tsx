import React from "react";
import styles from './training.module.scss'
import TrainingMenu from "./components/trainingMenu/trainingMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.training}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.menu}>
                <TrainingMenu />
            </div>
        </div>
    );
}