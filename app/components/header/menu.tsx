import styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";
import {useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme} from "../../../store/selectors";
import {useState} from "react";


const Menu = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div className={styles.menu}>
            <button className={styles.menu__btn} onClick={() => setIsActive(!isActive)}>
                {isActive
                    ? <Image
                        src="/icons/close.svg"
                        width={32}
                        height={32}
                        alt="settings"
                    />
                    : <Image
                        src="/icons/menuMob.svg"
                        width={32}
                        height={32}
                        alt="settings"
                    />
                }
            </button>
            <div className={isActive ? styles.menu__show : styles.menu__hide}>
                <div className={styles.menu__content}>
                    <Link href="/settings">
                        <span>Settings</span>
                    </Link>
                    <button className={styles.menu__language}>
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