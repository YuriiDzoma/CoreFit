'use client';
import Link from "next/link";
import styles from "./trainingMenu.module.scss";
import { usePathname } from "next/navigation";
import useWindowSize from "../../../hooks/useWindowSize";
import { useAppSelector } from "../../../hooks/redux";
import { getText } from "@/store/selectors";

const ITEM_DEFS = [
    {
        key: 'complexes' as const,
        href: '/training/complexes',
        isActive: (pathname: string) => pathname.startsWith('/training/complexes'),
    },
    {
        key: 'programs' as const,
        href: '/training',
        isActive: (pathname: string) =>
            pathname.startsWith('/training') &&
            !pathname.startsWith('/training/wiki') &&
            !pathname.startsWith('/training/complexes'),
    },
    {
        key: 'Wiki' as const,
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
                            <span className={active ? styles.labelActive : styles.label}>{base[item.key]}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TrainingMenu;
