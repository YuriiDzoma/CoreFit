'use client';
import Image from 'next/image';
import styles from './header.module.scss'
import Link from "next/link";
import useWindowSize from "../../hooks/useWindowSize";
import {useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme, getText, getUserId} from "../../../store/selectors";
import type { Session } from '@supabase/supabase-js';
import Menu from "./menu";
import HeaderNavigation from "./headerNavigation";
import {useFriendRequests} from "../../hooks/useFriendRequests";


const Header = ({ session }: { session: Session | null }) => {
    const currentId = useAppSelector(getUserId);
    const requests = useFriendRequests(currentId);

    const { base } = useAppSelector(getText);
    const { width } = useWindowSize();
    const isDark = useAppSelector(getIsDarkTheme);

    return (
        <div className={styles.header}>
            <Link className={styles.logo} href={'/'}>
                <Image
                    src={isDark ? "/logos/logo.png" : "/logos/logo-white.png"}
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
            <div className={styles.header__rightSection}>
                {requests.length > 0 && session && (
                    <Link href="/requests" className={styles.add}>
                        <Image
                            src={isDark ? "/icons/addFriend.svg" : "/icons/addFriendDark.svg"}
                            width={24}
                            height={24}
                            alt="requests"
                        />
                    </Link>
                )}
                {(width < 768 && session) ? <Menu /> : (width > 768 && session) ?  <HeaderNavigation /> : null }
            </div>
        </div>
    )
}

export default Header;