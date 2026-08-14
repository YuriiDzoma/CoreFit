import styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme, getText, getUserId} from "../../../store/selectors";
import React, {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {updateUserProfile} from "../../../lib/userData";
import {signOut} from "@/lib/authClient";
import { setIsDarkTheme } from '@/store/account-slice';
import Preloader from "../../../ui/preloader/Preloader";


const Menu = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const { base } = useAppSelector(getText);
    const router = useRouter();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    // Where the portaled dropdown should render -- measured from the real
    // button position (same technique the mobile app's own Header uses,
    // `measureInWindow`), since once portaled to `document.body` it can no
    // longer rely on `position: absolute` relative to `.menu` for that.
    const [anchor, setAnchor] = useState({ top: 0, right: 0 });
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    // `.header` is `position: fixed` but deliberately carries no `z-index`
    // of its own (see that rule's own comment) so it doesn't trap its
    // descendants in a stacking context of their own -- but that alone
    // turned out not to be reliable enough in practice (confirmed still
    // broken on /profile after that fix). Portaling `.shadow` and the
    // dropdown straight to `document.body` sidesteps the whole class of
    // "which ancestor might be trapping this" bug outright, the same way
    // any modal/dropdown implementation normally does, rather than
    // depending on every ancestor between here and the root never
    // acquiring a stacking context of its own. `mounted` guards against
    // `document` not existing during SSR.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openMenu = () => {
        const rect = menuBtnRef.current?.getBoundingClientRect();
        if (rect) {
            setAnchor({ top: rect.bottom, right: window.innerWidth - rect.right });
        }
        setIsActive(true);
    };

    const toggleMenu = () => (isActive ? setIsActive(false) : openMenu());

    const handleToggleTheme = async () => {
        if (!userId) return;
        setIsPreloader(true);

        const updatedTheme = await updateUserProfile(userId, { dark: !isDark });
        console.log(updatedTheme)
        const themeString = updatedTheme?.dark ? 'dark' : 'light';
        dispatch(setIsDarkTheme(updatedTheme?.dark));
        document.documentElement.setAttribute('data-theme', themeString);
        setIsPreloader(false);
    };

    const handleSignOut = async () => {
        setIsActive(false);
        await signOut();
        router.push('/');
    };

    return (
        <div className={styles.menu}>
            <button ref={menuBtnRef} className={styles.menu__btn} onClick={toggleMenu}>
                {isActive
                    ? <Image
                        src={isDark ? "/icons/closeDark.svg" : "/icons/close.svg"}
                        width={32}
                        height={32}
                        alt="settings"
                    />
                    : <Image
                        src={isDark ? "/icons/menuMob.svg" : "/icons/menuMobDark.svg"}
                        width={32}
                        height={32}
                        alt="settings"
                    />
                }
            </button>

            {mounted && createPortal(
                <>
                    <div
                        className={isActive ? styles.menu__show : styles.menu__hide}
                        style={{ top: anchor.top, right: anchor.right }}
                    >
                        <div className={styles.menu__content}>
                            <Link href="/settings" onClick={() => setIsActive(false)}>
                                <span>{base.settings}</span>
                            </Link>
                            <button className={styles.menu__language} onClick={handleToggleTheme}>
                                <span>{base.theme}: </span>
                                {isDark
                                    ? <Image
                                        src="/icons/darkTheme.svg"
                                        width={24}
                                        height={24}
                                        alt="settings"
                                    /> : <Image
                                        src="/icons/lightTheme.svg"
                                        width={24}
                                        height={24}
                                        alt="settings"
                                    />}
                            </button>
                            <button className={styles.menu__signOut} onClick={handleSignOut}>
                                <span>{base.signOut}</span>
                            </button>
                        </div>
                    </div>
                    <button className={isActive ? styles.shadowActive : styles.shadow}
                            disabled={!isActive}
                            onClick={() => setIsActive(false)}
                    />
                </>,
                document.body,
            )}
            {isPreloader && <Preloader />}
        </div>
    )
}

export default Menu;
