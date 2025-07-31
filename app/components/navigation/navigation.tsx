'use client';
import styles from './navigation.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useWindowSize from "../../hooks/useWindowSize";

const Navigation = () => {
    const pathname = usePathname();
    const { width } = useWindowSize();

    const isActive = (route: string) => pathname.startsWith(`${route}/`) || pathname === route;

    return (
        <div className={styles.navigation}>
            <Link
                href="/profile"
                className={pathname === '/profile' ? `${styles.link} ${styles.active}` : styles.link}
            >
                <span>Profile</span>
            </Link>

            <Link
                href="/training"
                className={`${styles.link} ${isActive('/training') ? styles.active : ''}`}
            >
                <span>Training</span>
            </Link>

            <Link
                href="/users"
                className={pathname === '/users' ? `${styles.link} ${styles.active}` : styles.link}
            >
                <span>Users</span>
            </Link>
        </div>
    );
};

export default Navigation;
