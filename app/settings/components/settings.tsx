'use client'
import React from "react";
import styles from './settings.module.scss';
import {LanguagesBox} from "./languagesBox";
import ProfileSettings from "./profileSettings";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";

const Settings = () => {
    const { base } = useAppSelector(getText);
    return (
        <div className={styles.settings}>
            <h2>{base.settings}</h2>
            <ProfileSettings />
            <LanguagesBox />
        </div>
    )
}

export default Settings;