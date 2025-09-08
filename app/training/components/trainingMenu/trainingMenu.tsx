'use client';
import Link from "next/link";
import styles from "./trainingMenu.module.scss";
import { usePathname } from "next/navigation";
import useWindowSize from "../../../hooks/useWindowSize";

const TrainingMenu = () => {
    const { width } = useWindowSize();
    const pathname = usePathname();

    if (width >= 768) return null;

    const getLinkClass = (path: string, options?: { includeSubpaths?: boolean }) => {
        let isActive = false;

        if (options?.includeSubpaths) {
            isActive = pathname.startsWith(path);
        } else if (path === '/training') {
            isActive =
                pathname.startsWith('/training') &&
                !pathname.startsWith('/training/wiki') &&
                !pathname.startsWith('/training/complexes');
        } else {
            isActive = pathname.startsWith(path);
        }

        return `${styles.link} button ${isActive ? styles.active : ''}`;
    };



    return (
        <div className={styles.trainingMenu}>
            <Link href="/training/complexes" className={getLinkClass('/training/complexes')}>
                <span>Complexes</span>
            </Link>

            <Link href="/training" className={getLinkClass('/training', { includeSubpaths: true })}>
                <span>Programs</span>
            </Link>

            <Link href="/training/wiki" className={getLinkClass('/training/wiki')}>
                <span>Wiki</span>
            </Link>
        </div>
    );
};

export default TrainingMenu;
