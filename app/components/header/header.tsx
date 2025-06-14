'use client';
import Image from 'next/image';
import styles from './header.module.scss';
import Link from 'next/link';
import useWindowSize from '../../hooks/useWindowSize';
import {useAppSelector} from '../../hooks/redux';
import {getIsDarkTheme, getText, getUserId} from '../../../store/selectors';
import type {Session} from '@supabase/supabase-js';
import Menu from './menu';
import HeaderNavigation from './headerNavigation';

import {useFriendRequestStore} from '@/store/useFriendRequestStore';
import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";

const Header = ({session}: { session: Session | null }) => {
    const userId = useAppSelector(getUserId);
    const {base} = useAppSelector(getText);
    const {width} = useWindowSize();
    const isDark = useAppSelector(getIsDarkTheme);
    const router = useRouter();

    const {requests, subscribeToRealtime} = useFriendRequestStore();

    const onBack = () => {
        router.back()
    }

    useEffect(() => {
        if (userId) {
            subscribeToRealtime(userId);
        }
    }, [userId]);

    return (
        <div className={styles.header}>
            {userId && width < 1024 && <button onClick={() => onBack()} className={styles.back}>
                <Image
                    src={isDark ? '/icons/backWhite.svg' : '/icons/backDark.svg'}
                    width={32}
                    height={32}
                    alt="back"
                    unoptimized
                />
            </button>}

            <Link className={styles.logo} href={'/'}>
                <Image
                    src={isDark ? '/logos/logo.png' : '/logos/logo-white.png'}
                    width={width < 768 ? 32 : 52}
                    height={width < 768 ? 32 : 52}
                    alt="logo"
                />
                <p>COREFIT</p>
            </Link>


            {!session && (
                <Link href="/login" className="button">
                    <span>{base.login}</span>
                </Link>
            )}

            {session && (
                <div className={styles.header__rightSection}>
                    {requests.length > 0 && (
                        <Link href="/requests" className={styles.add}>
                            <Image
                                src={isDark ? '/icons/addFriend.svg' : '/icons/addFriendDark.svg'}
                                width={24}
                                height={24}
                                alt="requests"
                            />
                        </Link>
                    )}
                    {width < 768 ? <Menu/> : <HeaderNavigation/>}
                </div>
            )}
        </div>
    );
};

export default Header;
