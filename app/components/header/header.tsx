'use client';
import Image from 'next/image';
import styles from './header.module.scss'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";


const Header = () => {
    const { base } = useAppSelector(getText)
    const { width } = useWindowSize();
    return (
        <div className={styles.header}>
            <Link className={styles.logo} href={'/'}>
                <Image
                    src="/logos/logo.png"
                    width={width < 768 ? 32 : 52}
                    height={width < 768 ? 32 : 52}
                    alt="Screenshots of the dashboard project showing desktop version"
                />
                <p>COREFIT</p>
            </Link>
            <Link href="/login" className={`button`}>
                <span>{base.login}</span>
            </Link>
        </div>

    )
}

export default Header;