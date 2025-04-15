'use client';
import Image from 'next/image';
import styles from './header.module.scss'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import type { Session } from '@supabase/supabase-js';


const Header = ({ session }: { session: Session | null }) => {
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
            {!session && (
                <Link href="/login" className={`button`}>
                    <span>{base.login}</span>
                </Link>
            )}
        </div>

    )
}

export default Header;