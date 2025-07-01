'use client';

import React, {useEffect, useState} from "react";
import styles from './trainingHistories.module.scss';
import {useAppSelector} from "../../hooks/redux";
import {getLanguage, getText} from "../../../store/selectors";
import {
    fetchAllTrainingHistories,
    fetchExercisesByIds
} from "@/lib/trainingData";
import {fetchProgramExerciseMap} from "../../../lib/trainingData";
import {NewsSkeleton} from "../../../ui/skeleton/skeleton";
import Link from "next/link";

const TrainingHistories = () => {
    const [histories, setHistories] = useState<any[]>([]);
    const [exerciseMap, setExerciseMap] = useState<Record<string, { name: string; image: string }>>({});
    const language = useAppSelector(getLanguage);
    const {training} = useAppSelector(getText);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMap, setIsMap] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        const load = async () => {
            const results = await fetchAllTrainingHistories();
            setHistories(results);

            const programExIds = Array.from(
                new Set(results.flatMap((entry) => Object.keys(entry.values)))
            );

            const programToExerciseMap = await fetchProgramExerciseMap(programExIds);

            const exerciseIds = Array.from(new Set(Object.values(programToExerciseMap)));

            const lang = language === 'ua' ? 'ukr' : language;
            const map = await fetchExercisesByIds(exerciseIds, lang as 'eng' | 'ukr' | 'rus');
            setIsMap(false);

            const finalMap: Record<string, { name: string; image: string }> = {};
            for (const [progId, exId] of Object.entries(programToExerciseMap)) {
                if (map[exId]) {
                    finalMap[progId] = map[exId];
                }
            }
            setIsLoading(false);
            setExerciseMap(finalMap);
        };

        load();
    }, [language]);

    if (isMap) return <NewsSkeleton/>

    return (
        <div className={`${styles.histories} container`}>
            {histories.map((entry) => (
                <div key={entry.id} className={styles.historyCard}>
                    <div className={styles.historyCard__header}>
                        <Link href={`/profile/${entry.profiles.id}`} className={styles.userInfo}>
                            <img src={entry.profiles.avatar_url} width='32px' height={'32px'} alt="avatar"/>
                            <p>{entry.profiles.username}</p>
                        </Link>

                        <div className={styles.datBox}>
                            <span>{training.finished}</span>
                            <p className={styles.date}>
                                {new Date(entry.date).toLocaleString('uk-UA', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>

                    <ul className={styles.exerciseList}>
                        {Object.entries(entry.values as Record<string, string>).map(([exId, value]) => (
                            <li key={exId}>
                                {isLoading
                                    ? <span className={styles.exerciseLoad}/>
                                    : <p>{exerciseMap[exId]?.name || exId}: <span
                                        className={styles.exerciseList__weight}>{value}</span></p>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TrainingHistories;
