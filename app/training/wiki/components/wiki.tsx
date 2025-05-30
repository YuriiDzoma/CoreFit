'use client';

import styles from './wiki.module.scss'
import React, { useEffect, useState } from 'react';
import WikiNav from "./wikiNav";
import {useAppSelector} from "../../../hooks/redux";
import {getLanguage} from "../../../../store/selectors";
import {fetchExercisesByGroup} from "../../../../lib/trainingData";
import Preloader from "../../../../ui/preloader/Preloader";

export default function Wiki() {
    const language = useAppSelector(getLanguage);

    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('All')
    const [exercises, setExercises] = useState<string[]>([]);

    console.log(language)

    const fetchExercises = (value: string) => {
        const loadExercises = async () => {
            const names = await fetchExercisesByGroup(value);
            setExercises(names);
            setIsPreloader(false);
        };

        loadExercises();
    }

    useEffect(() => {
        fetchExercises('All');
    }, []);

    const handleChangeTab = (value: string) => {
        setIsPreloader(true)
        setActiveTab(value);
        fetchExercises(value);

    }

    return (
        <div>
            <h2 className={'pageTitle'}>Wiki Page</h2>
            <div className={styles.content}>
                <ul>
                    {exercises.map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
                <WikiNav activeTab={activeTab} handleChangeTab={handleChangeTab} />
            </div>
            {isPreloader && <Preloader />}
        </div>
    );
}