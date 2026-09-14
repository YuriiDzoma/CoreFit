'use client';

import styles from './programDetail.module.scss'
import React from "react";
import {useAppSelector} from "../../../../hooks/redux";
import {getText} from "../../../../../store/selectors";

interface ProgramTabsTypes {
    activeTab: number,
    setActiveTab: (value: number) => void,
}

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>
);

const TextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="18" x2="14" y2="18"/>
    </svg>
);

const ProgramTabs = ({activeTab, setActiveTab}: ProgramTabsTypes) => {
    const {training} = useAppSelector(getText);

    return (
        <div className={styles.tabBoxWrap}>
            <div className={styles.tabBox}>
                <div className={styles.tab}>
                    <p><ImageIcon/></p>
                    <input
                        checked={activeTab === 1}
                        onChange={() => setActiveTab(1)}
                        name={'tabs'}
                        type="radio"
                        aria-label={training.programViewIcons}
                    />
                </div>
                <div className={styles.tab}>
                    <p><TextIcon/></p>
                    <input
                        // A legacy program_view_density of 3 (the removed
                        // third density option) still needs to land on
                        // this button, not neither -- it always rendered
                        // as text, same as this one.
                        checked={activeTab !== 1}
                        onChange={() => setActiveTab(2)}
                        name={'tabs'}
                        type="radio"
                        aria-label={training.programViewText}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProgramTabs;
