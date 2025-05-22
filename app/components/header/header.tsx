'use client';
import Image from 'next/image';
import styles from './header.module.scss'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";
import {useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme, getText} from "../../../store/selectors";
import type { Session } from '@supabase/supabase-js';
import Menu from "./menu";


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
                    alt="logo"
                />
                <p>COREFIT</p>
            </Link>
            {!session && (
                <Link href="/login" className={`button`}>
                    <span>{base.login}</span>
                </Link>
            )}
            {(width < 768 && session) && <Menu /> }
        </div>
    )
}

export default Header;