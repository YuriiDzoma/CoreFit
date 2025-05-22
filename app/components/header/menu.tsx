import styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme, getUserId} from "../../../store/selectors";
import React, {useState} from "react";
import {toggleThemeInDB} from "../../../lib/userData";
import { setIsDarkTheme } from '@/store/account-slice';


const Menu = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleToggleTheme = async () => {
        if (!userId) return;

        const updatedTheme = await toggleThemeInDB(userId, isDark);
        const themeString = updatedTheme ? 'dark' : 'light';
        dispatch(setIsDarkTheme(updatedTheme));
        document.documentElement.setAttribute('data-theme', themeString);
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
                        <span>Settings</span>
                    </Link>
                    <button className={styles.menu__language} onClick={handleToggleTheme}>
                        <span>Theme: </span>
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
                    onClick={() => setIsActive(false)}/>

        </div>
    )
}

export default Menu;