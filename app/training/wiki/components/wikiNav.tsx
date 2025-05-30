import React from "react";
import styles from './wiki.module.scss'
import Image from "next/image";
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme} from "../../../../store/selectors";

interface WikiNavTypes {
    activeTab: string,
    handleChangeTab: (value: string) => void,
}

const WikiNav = ( {activeTab, handleChangeTab}:WikiNavTypes ) => {
    const isDark = useAppSelector(getIsDarkTheme);

    const navigation = [
        {name: 'All', icon: '/musclesIcons/all.png', iconLight: '/musclesIcons/allLight.png'},
        {name: 'Chest', icon: '/musclesIcons/chest.png', iconLight: '/musclesIcons/chestLight.png'},
        {name: 'Back', icon: '/musclesIcons/back.png', iconLight: '/musclesIcons/backLight.png'},
        {name: 'Biceps', icon: '/musclesIcons/biceps.png', iconLight: '/musclesIcons/bicepsLight.png'},
        {name: 'Triceps', icon: '/musclesIcons/triceps.png', iconLight: '/musclesIcons/tricepsLight.png'},
        {name: 'Shoulders', icon: '/musclesIcons/shoulders.png', iconLight: '/musclesIcons/shouldersLight.png'},
        {name: 'Legs', icon: '/musclesIcons/legs.png', iconLight: '/musclesIcons/legsLight.png'},
        {name: 'Abs', icon: '/musclesIcons/abs.png', iconLight: '/musclesIcons/absLight.png'},
    ];

    return (
        <div className={styles.nav}>
            {navigation && navigation.map((item, index) => (
                <button key={index} className={activeTab === item.name ? styles.tabActive : styles.tab}
                        onClick={() => handleChangeTab(item.name)}
                >
                    <Image
                        src={isDark ? item.iconLight : item.icon}
                        width={32}
                        height={32}
                        alt={item.name}
                        unoptimized
                    />
                    <span>{item.name}</span>
                </button>
            ))}
        </div>
    )
}

export default WikiNav;