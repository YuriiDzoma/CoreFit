
import styles from './programDetail.module.scss'
import React from "react";


interface ProgramTabsTypes {
    activeTab: number,
    setActiveTab: (value: number) => void,
}

const programViews = [
    {name: 'I', value: 1},
    {name: 'II', value: 2},
    {name: 'III', value: 3},
]

const ProgramTabs = ({activeTab, setActiveTab}: ProgramTabsTypes) => {
    return (
        <div className={styles.tabBox}>
            {programViews && programViews.map((item, index) => (
                <div key={index} className={styles.tab}>
                    <p>{item.name}</p>
                    <input checked={activeTab === item.value} onChange={() => setActiveTab(item.value)} name={'tabs'} type="radio"/>
                </div>
            ))}
        </div>
    )
}

export default ProgramTabs;