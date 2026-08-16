'use client';
import React, { useEffect, useState } from "react";
import styles from './settings.module.scss';
import { useAppSelector } from "../../hooks/redux";
import { getText, getUserId } from "../../../store/selectors";
import { fetchUserSettings, updateUserProfile } from "../../../lib/userData";
import Preloader from "../../../ui/preloader/Preloader";

// Same instant-apply, single-toggle-row shape as LanguagesBox above it,
// reusing its exact checkbox/checkboxActive dot styling (settings.module.scss's
// shared .languages/.profile/.trainer block) rather than a new pattern --
// this is a boolean, not a multi-choice list, so there's just one row.
const TrainerSettings = () => {
    const { settings } = useAppSelector(getText);
    const userId = useAppSelector(getUserId);
    const [isTrainer, setIsTrainer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPreloader, setIsPreloader] = useState(false);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        fetchUserSettings(userId).then((s) => {
            setIsTrainer(s.is_trainer ?? false);
            setLoading(false);
        });
    }, [userId]);

    const handleToggle = async () => {
        if (!userId) return;
        const next = !isTrainer;
        setIsPreloader(true);
        const result = await updateUserProfile(userId, { is_trainer: next });
        if (result) setIsTrainer(next);
        setIsPreloader(false);
    };

    if (loading) return null;

    return (
        <div className={styles.trainer}>
            <p className={styles.languages__title}>{settings.trainerSection}</p>
            <button className={styles.languages__btn} onClick={handleToggle}>
                <span className={styles.languages__name}>{settings.trainerToggle}</span>
                <span className={isTrainer ? styles.languages__checkboxActive : styles.languages__checkbox} />
            </button>
            <p className={styles.trainer__hint}>{settings.trainerHint}</p>
            {isPreloader && <Preloader />}
        </div>
    );
};

export default TrainerSettings;
