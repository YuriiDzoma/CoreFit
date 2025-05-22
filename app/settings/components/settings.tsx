import React from "react";
import styles from './settings.module.scss';
import {LanguagesBox} from "./languagesBox";

const Settings = () => {
    return (
        <div className={styles.settings}>
            <h2>Settings</h2>
            <LanguagesBox />
        </div>
    )
}

export default Settings;