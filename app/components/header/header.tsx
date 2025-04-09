'use client';
import Image from 'next/image';
import styles from './header.module.scss'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";


const Header = () => {
    const { width } = useWindowSize();
    return (
        <div className={styles.header}>
            <Link className={styles.logo} href={'/'}>
                <Image
                    src="/logos/logo.png"
                    width={width < 768 ? 32 : 64}
                    height={width < 768 ? 32 : 64}
                    alt="Screenshots of the dashboard project showing desktop version"
                />
                <p>COREFIT</p>
            </Link>
            <Link href="/login" className={`button`}>
                <span>Log in</span>
            </Link>
        </div>

    )
}

export default Header;