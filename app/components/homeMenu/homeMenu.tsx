'use client';
import Link from "next/link";
import styles from "./homeMenu.module.scss";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../hooks/redux";
import { getText } from "@/store/selectors";
import useWindowSize from "../../hooks/useWindowSize";

const ITEM_DEFS = [
    {
        key: 'records' as const,
        href: '/records',
        isActive: (pathname: string) => pathname === '/records',
    },
    {
        key: 'trainings' as const,
        href: '/',
        isActive: (pathname: string) => pathname === '/',
    },
];

// Records/Trainings -- Home's own floating glass pill bar, same structure
// and same narrow-only gating as friendsMenu.tsx/trainingMenu.tsx: at
// desktop width, Navigation is an in-flow top tab row, so a fixed-position
// pill here would float disconnected from the rest of desktop chrome.
const HomeMenu = () => {
    const { width } = useWindowSize();
    const pathname = usePathname();
    const { base } = useAppSelector(getText);

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
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeMenu;
