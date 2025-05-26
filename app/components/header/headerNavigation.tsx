import React from "react";
import Link from "next/link";
import styles from "./header.module.scss";
import {usePathname} from "next/navigation";


const HeaderNavigation = () => {
    const pathname = usePathname();

    const nav = [
        {title: 'Wiki', src: '/training/wiki'},
        {title: 'Complexes', src: '/training/complexes'},
        {title: 'Settings', src: '/settings'},
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