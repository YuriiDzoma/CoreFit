'use client';

import React, { useEffect, useState } from 'react';
import styles from './programDetail.module.scss';
import { ProgramFull } from '../../../../../types/training';
import {useAppSelector} from "../../../../hooks/redux";
import {getLanguage, getText} from "../../../../../store/selectors";
import {fetchExercisesByIds} from "../../../../../lib/trainingData";
import {ProgramDetailExercisesSkeleton, ProgramDetailSkeleton} from "../../../../../ui/skeleton/skeleton";

interface ProgramDaysListTypes {
    program: ProgramFull,
    activeTab: number,
}

const ProgramDaysList = ({ program, activeTab }: ProgramDaysListTypes) => {
    const { training } = useAppSelector(getText);
    const language = useAppSelector(getLanguage);
    const [exerciseMap, setExerciseMap] = useState<Record<string, { name: string; image: string }>>({});
    const [loading, setLoading] = useState<boolean>(true);

    const handleView = (value: number) => {
        switch (value) {
            case 1:
                return styles.firstLevel;
            case 2:
                return styles.secondLevel;
            case 3:
                return styles.thirdLevel;
            default:
                return '';
        }
    };

    useEffect(() => {
        const load = async () => {
            const ids = [...new Set(program.days.flatMap((d) => d.exercises.map(e => e.id)))];

            if (!language || !ids.length) return;

            const map = await fetchExercisesByIds(ids, language as 'eng' | 'ukr' | 'rus');
            setExerciseMap(map);
            setLoading(false);
        };

        load();
    }, [program, language]);

    if (loading) return <ProgramDetailExercisesSkeleton />;

    return (
        <div className={styles.programDays}>
            {program.days.map((day) => (
                <ul key={day.day_number}>
                    <h3>{training.day} {day.day_number}</h3>
                    {day.exercises.map((exercise, idx) => {
                        const ex = exerciseMap[exercise.id];
                        return (
                            <li key={exercise.programExerciseId} title={ex?.name || exercise.id} className={handleView(activeTab)}>
                                {activeTab === 1 && (
                                    <div>{idx + 1}. <img src={ex?.image} alt={ex?.name} width={50} height={50} /></div>
                                )}
                                {activeTab === 2 && (
                                    <span>{idx + 1}. {ex?.name || exercise.id}</span>
                                )}
                                {activeTab === 3 && (
                                    <p>{idx + 1}. {ex?.name || exercise.id}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ))}
        </div>
    );
};

export default ProgramDaysList;
