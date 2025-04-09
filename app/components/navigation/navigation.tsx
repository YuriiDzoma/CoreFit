'use client';
import styles from './navigation.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
    const pathname = usePathname();

    const isActive = (route: string) => pathname === route || pathname.startsWith(`${route}/`);

    return (
        <div className={styles.navigation}>
            <Link
                href="/profile"
                className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}
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
                className={`${styles.link} ${isActive('/users') ? styles.active : ''}`}
            >
                <span>Users</span>
            </Link>
        </div>
    );
};

export default Navigation;
