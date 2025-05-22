'use client';
import React from "react";
import styles from './settings.module.scss';
import { getLanguage, getText, getUserId } from "../../../store/selectors";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateUserLanguage } from "../../../lib/userData";
import { getLanguages } from "../../../lib/languages";
import { setText } from '@/store/language-slice';
import { setLanguage } from '@/store/account-slice';

export const LanguagesBox = () => {
    const {base} = useAppSelector(getText);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(getLanguage);

    const handleChangeLanguage = async (lang: string) => {
        if (!userId) return;

        const success = await updateUserLanguage(userId, lang);
        if (success) {
            dispatch(setLanguage(lang));
            const translations = await getLanguages(lang);
            dispatch(setText(translations));
        }
    };
    const languages = [
        {value: 'eng', name: base.english},
        {value: 'rus', name: base.russian},
        {value: 'ukr', name: base.ukrainian},
    ]
    return (
        <div className={styles.languages}>
            <p>languages changer</p>
            {languages && languages.map((lan, index) => (
                <button key={index} className={styles.languages__btn} onClick={() => handleChangeLanguage(lan.value)}>
                    <span className={styles.languages__title}>{lan.name}</span>
                    <span className={currentLanguage === lan.value ? styles.languages__checkboxActive : styles.languages__checkbox}/>
                </button>
            ))}
        </div>
    )
}