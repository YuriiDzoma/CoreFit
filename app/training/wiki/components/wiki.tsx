'use client';

import styles from './wiki.module.scss'
import React, { useEffect, useMemo, useState } from 'react';
import WikiNav from "./wikiNav";
import {useAppSelector} from "../../../hooks/redux";
import {getLanguage, getText} from "../../../../store/selectors";
import {fetchExercisesByGroup} from "../../../../lib/trainingData";
import Preloader from "../../../../ui/preloader/Preloader";
import Exercise from "./Exercise";
import {exerciseTypes} from "../../../../types/training";
import {ExerciseListSkeleton} from "../../../../ui/skeleton/skeleton";


export default function Wiki() {
    const language = useAppSelector(getLanguage);
    const { base, training } = useAppSelector(getText);

    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('All')
    const [exercises, setExercises] = useState<exerciseTypes[]>([]);
    // Client-side, on top of whatever the current muscle-group tab already
    // fetched -- matches the mobile app's own `useExerciseBrowser` (muscle
    // group is a server-side re-fetch per tab, search filters the already-
    // loaded result), not a second server round-trip.
    const [searchQuery, setSearchQuery] = useState<string>('');


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

    const filteredExercises = useMemo(() => {
        const trimmedQuery = searchQuery.trim().toLowerCase();
        if (!trimmedQuery) return exercises;
        return exercises.filter((item) => item.name.toLowerCase().includes(trimmedQuery));
    }, [exercises, searchQuery]);

    return (
        <div>
            <h2 className={`pageTitle ${styles.title}`}>{base.Wiki}</h2>

            {!exercises.length ? (
                <ExerciseListSkeleton />
            ) : (
                <>
                    <div className={styles.searchRow}>
                        <input
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder={training.searchExercises}
                            type="search"
                        />
                        {searchQuery.length > 0 && (
                            <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
                                ✕
                            </button>
                        )}
                    </div>

                    <div className={styles.content}>
                        <ul className={styles.exercisesList}>
                            {filteredExercises.length === 0 ? (
                                <li className={styles.emptyState}>
                                    {training.noExercisesMatch.replace('{value}', searchQuery.trim())}
                                </li>
                            ) : (
                                filteredExercises.map((item, index) => (
                                    <Exercise key={index} item={item} />
                                ))
                            )}
                        </ul>
                        <WikiNav activeTab={activeTab} handleChangeTab={handleChangeTab} />
                    </div>
                </>
            )}
            {isPreloader && <Preloader />}
        </div>
    );
}