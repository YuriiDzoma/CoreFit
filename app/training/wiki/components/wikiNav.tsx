import React from "react";
import styles from './wiki.module.scss'
import Image from "next/image";
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme, getText} from "../../../../store/selectors";

interface WikiNavTypes {
    activeTab: string,
    handleChangeTab: (value: string) => void,
    isCreate?: boolean,
}

const WikiNav = ( {activeTab, handleChangeTab, isCreate = false }:WikiNavTypes ) => {
    const isDark = useAppSelector(getIsDarkTheme);
    const { training } = useAppSelector(getText);

    const navigation = [
        {name: training.all, icon: '/musclesIcons/all.png', iconLight: '/musclesIcons/allLight.png', value: 'All'},
        {name: training.chest, icon: '/musclesIcons/chest.png', iconLight: '/musclesIcons/chestLight.png', value: 'Chest'},
        {name: training.backMus, icon: '/musclesIcons/back.png', iconLight: '/musclesIcons/backLight.png', value: 'Back'},
        {name: training.biceps, icon: '/musclesIcons/biceps.png', iconLight: '/musclesIcons/bicepsLight.png', value: 'Biceps'},
        {name: training.triceps, icon: '/musclesIcons/triceps.png', iconLight: '/musclesIcons/tricepsLight.png', value: 'Triceps'},
        {name: training.shoulders, icon: '/musclesIcons/shoulders.png', iconLight: '/musclesIcons/shouldersLight.png', value: 'Shoulders'},
        {name: training.legs, icon: '/musclesIcons/legs.png', iconLight: '/musclesIcons/legsLight.png', value: 'Legs'},
        {name: training.abs, icon: '/musclesIcons/abs.png', iconLight: '/musclesIcons/absLight.png', value: 'Abs'},
    ];

    return (
        <div className={isCreate ? `${styles.navCreate}` : `${styles.nav}`}>
            {navigation && navigation.map((item, index) => (
                <button key={index} className={activeTab === item.value ? styles.tabActive : styles.tab}
                        onClick={() => handleChangeTab(item.value)}
                >
                    <Image
                        src={isDark ? item.iconLight : item.icon}
                        width={isCreate ? 28 : 32}
                        height={isCreate ? 28 : 32}
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