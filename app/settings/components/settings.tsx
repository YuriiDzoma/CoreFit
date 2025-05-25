import React from "react";
import styles from './settings.module.scss';
import {LanguagesBox} from "./languagesBox";
import ProfileSettings from "./profileSettings";

const Settings = () => {
    return (
        <div className={styles.settings}>
            <h2>Settings</h2>
            <ProfileSettings />
            <LanguagesBox />
        </div>
    )
}

export default Settings;