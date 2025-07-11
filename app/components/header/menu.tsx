import styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme, getText, getUserId} from "../../../store/selectors";
import React, {useState} from "react";
import {updateUserProfile} from "../../../lib/userData";
import { setIsDarkTheme } from '@/store/account-slice';
import Preloader from "../../../ui/preloader/Preloader";


const Menu = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const { base } = useAppSelector(getText);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);

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

    return (
        <div className={styles.menu}>
            <button className={styles.menu__btn} onClick={() => setIsActive(!isActive)}>
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
            <div className={isActive ? styles.menu__show : styles.menu__hide}>
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
                </div>
            </div>
            <button className={isActive ? styles.shadowActive : styles.shadow}
                    disabled={!isActive}
                    onClick={() => setIsActive(false)}
            />
            {isPreloader && <Preloader />}
        </div>
    )
}

export default Menu;