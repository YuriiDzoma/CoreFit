'use client';
import Link from "next/link";
import styles from "./subTabs.module.scss";

export type SubTabItem = {
    key: string;
    href: string;
    label: string;
    active: boolean;
    badge?: number;
};

// Desktop/tablet (>768px) shape of a section's sub-navigation
// (HomeMenu/FriendsMenu/TrainingMenu): an in-flow segmented control at
// the top of the page, where the mobile layout floats a glass pill bar
// above the main Navigation instead. Same items, same order, only the
// presentation differs.
const SubTabs = ({ items }: { items: SubTabItem[] }) => (
    <nav className={styles.tabs}>
        {items.map((item) => (
            <Link
                key={item.key}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={item.active ? styles.tabActive : styles.tab}
            >
                {item.label}
                {!!item.badge && (
                    <span className={styles.badge}>{item.badge > 99 ? '99+' : item.badge}</span>
                )}
            </Link>
        ))}
    </nav>
);

export default SubTabs;
