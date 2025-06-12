'use client';

import React, { useEffect, useState } from "react";
import styles from './trainingHistories.module.scss';
import { useAppSelector } from "../../hooks/redux";
import { getLanguage } from "../../../store/selectors";
import {
    fetchAllTrainingHistories,
    fetchExercisesByIds
} from "@/lib/trainingData";

const TrainingHistories = () => {
    const [histories, setHistories] = useState<any[]>([]);
    const [exerciseMap, setExerciseMap] = useState<Record<string, { name: string; image: string }>>({});
    const language = useAppSelector(getLanguage);

    useEffect(() => {
        const load = async () => {
            const results = await fetchAllTrainingHistories();
            setHistories(results);

            const allIds = Array.from(
                new Set(results.flatMap((entry) => Object.keys(entry.values)))
            );

            const lang = language === 'ua' ? 'ukr' : language;
            const map = await fetchExercisesByIds(allIds, lang as 'eng' | 'ukr' | 'rus');
            setExerciseMap(map);
        };

        load();
    }, [language]);

    return (
        <div className={styles.histories}>
            {histories.map((entry) => (
                <div key={entry.id} className={styles.historyCard}>
                    <div className={styles.userInfo}>
                        <img src={entry.profiles.avatar_url} alt="avatar" />
                        <p>{entry.profiles.username}</p>
                    </div>

                    <p className={styles.date}>
                        {new Date(entry.date).toLocaleString('uk-UA', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>

                    <ul className={styles.exerciseList}>
                        {Object.entries(entry.values as Record<string, string>).map(([exId, value]) => (
                            <li key={exId}>
                                <strong>{exerciseMap[exId]?.name || exId}</strong>: {value}
                            </li>
                        ))}
                    </ul>

                </div>
            ))}
        </div>
    );
};

export default TrainingHistories;
