'use client';

import styles from './wiki.module.scss'
import React, { useEffect, useState } from 'react';
import WikiNav from "./wikiNav";
import {useAppSelector} from "../../../hooks/redux";
import {getLanguage} from "../../../../store/selectors";
import {fetchExercisesByGroup} from "../../../../lib/trainingData";
import Preloader from "../../../../ui/preloader/Preloader";
import Exercise from "./Exercise";
import {exerciseTypes} from "../../../../types/training";
import {ExerciseListSkeleton} from "../../../../ui/skeleton/skeleton";


export default function Wiki() {
    const language = useAppSelector(getLanguage);

    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('All')
    const [exercises, setExercises] = useState<exerciseTypes[]>([]);


    const fetchExercises = (value: string) => {
        const loadExercises = async () => {
            if (!language) return
            const names = await fetchExercisesByGroup(value, language as 'eng' | 'ukr' | 'rus');

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

    if (!exercises.length) return <ExerciseListSkeleton />

    return (
        <div>
            <h2 className={'pageTitle'}>Wiki Page</h2>
            <div className={styles.content}>
                <ul className={styles.exercisesList}>
                    {exercises?.length && exercises.map((item, index) => (
                        <Exercise key={index} item={item} />
                    ))}
                </ul>
                <WikiNav activeTab={activeTab} handleChangeTab={handleChangeTab} />
            </div>
            {isPreloader && <Preloader />}
        </div>
    );
}