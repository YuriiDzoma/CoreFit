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
                            <li key={exercise.programExerciseId} title={ex?.name || exercise.id}>
                                {activeTab === 1 ? (
                                    <div>{idx + 1}. <img src={ex?.image} alt={ex?.name} width={50} height={50} /></div>
                                ) : (
                                    // Anything other than the icon view (2, or a
                                    // legacy-persisted 3 from before the density
                                    // picker was narrowed to two options) renders
                                    // as text -- there's no third variant anymore.
                                    <span>{idx + 1}. {ex?.name || exercise.id}</span>
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
