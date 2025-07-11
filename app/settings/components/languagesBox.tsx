'use client';
import React, {useState} from "react";
import styles from './settings.module.scss';
import { getLanguage, getText, getUserId } from "../../../store/selectors";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateUserProfile } from "../../../lib/userData";
import { getLanguages } from "../../../lib/languages";
import { setText } from '@/store/language-slice';
import { setLanguage } from '@/store/account-slice';
import Preloader from "../../../ui/preloader/Preloader";

export const LanguagesBox = () => {
    const {settings} = useAppSelector(getText);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(getLanguage);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);

    const handleChangeLanguage = async (lang: string) => {
        if (!userId) return;
        setIsPreloader(true);
        const success = await updateUserProfile(userId, {language: lang});
        if (success) {
            dispatch(setLanguage(lang));
            const translations = await getLanguages(lang);
            dispatch(setText(translations));
        }
        setIsPreloader(false);
    };
    const languages = [
        {value: 'eng', name: settings.english},
        {value: 'rus', name: settings.russian},
        {value: 'ukr', name: settings.ukrainian},
        {value: 'pl', name: settings.poland},
    ]

    return (
        <div className={styles.languages}>
            <p className={styles.languages__title}>{settings.language}</p>
            <div className={styles.languages__list}>
                {languages && languages.map((lan, index) => (
                    <button key={index} className={styles.languages__btn} onClick={() => handleChangeLanguage(lan.value)}>
                        <span className={styles.languages__name}>{lan.name}</span>
                        <span className={currentLanguage === lan.value ? styles.languages__checkboxActive : styles.languages__checkbox}/>
                    </button>
                ))}
            </div>
            {isPreloader && <Preloader />}
        </div>
    )
}