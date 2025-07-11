'use client';
import Link from "next/link";
import styles from "./trainingMenu.module.scss";
import { usePathname } from "next/navigation";
import useWindowSize from "../../../hooks/useWindowSize";

const TrainingMenu = () => {
    const { width } = useWindowSize();
    const pathname = usePathname();

    if (width >= 768) return null;

    const getLinkClass = (path: string) =>
        `${styles.link} button ${pathname.startsWith(path) ? styles.active : ''}`;


    return (
        <div className={styles.trainingMenu}>
            <Link href="/training/complexes" className={getLinkClass('/training/complexes')}>
                <span>Complexes</span>
            </Link>

            <Link href="/training" className={getLinkClass('/training')}>
                <span>Programs</span>
            </Link>

            <Link href="/training/wiki" className={getLinkClass('/training/wiki')}>
                <span>Wiki</span>
            </Link>
        </div>
    );
};

export default TrainingMenu;
