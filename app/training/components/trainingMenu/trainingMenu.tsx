'use client';
import Link from "next/link";
import styles from "./trainingMenu.module.scss";
import { usePathname } from "next/navigation";
import useWindowSize from "../../../hooks/useWindowSize";

const ITEMS = [
    {
        label: 'Complexes',
        href: '/training/complexes',
        isActive: (pathname: string) => pathname.startsWith('/training/complexes'),
    },
    {
        label: 'Programs',
        href: '/training',
        isActive: (pathname: string) =>
            pathname.startsWith('/training') &&
            !pathname.startsWith('/training/wiki') &&
            !pathname.startsWith('/training/complexes'),
    },
    {
        label: 'Wiki',
        href: '/training/wiki',
        isActive: (pathname: string) => pathname.startsWith('/training/wiki'),
    },
];

// Floating glass pill bar, matching the mobile app's own `TrainingSubNav`
// -- see that component's comment for why this is a deliberate floating
// bar rather than in-flow chrome now that Header/Navigation are both
// floating too.
const TrainingMenu = () => {
    const { width } = useWindowSize();
    const pathname = usePathname();

    if (width >= 768) return null;

    return (
        <div className={styles.floatingWrap}>
            <div className={styles.floatingBar}>
                {ITEMS.map((item) => {
                    const active = item.isActive(pathname);

                    return (
                        <Link key={item.label} href={item.href} className={styles.floatingItem}>
                            <span className={active ? styles.floatingPillActive : styles.floatingPill} />
                            <span className={active ? styles.labelActive : styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TrainingMenu;
