import React from "react";
import Link from "next/link";
import styles from "./header.module.scss";
import {usePathname} from "next/navigation";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";


const HeaderNavigation = () => {
    const pathname = usePathname();
    const { base } = useAppSelector(getText);

    const nav = [
        {title: 'Wiki', src: '/training/wiki'},
        {title: base.complexes, src: '/training/complexes'},
        {title: base.settings, src: '/settings'},
    ]

    return (
        <div className={styles.headerNav}>
            {nav && nav.map((item, index) => (
                <Link key={index} href={item.src} className={pathname === item.src ? styles.linkActive : styles.link}>
                    <span>{item.title}</span>
                </Link>
            ))}
        </div>
    )
}

export default HeaderNavigation;