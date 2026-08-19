'use client';

import React, {useEffect, useState} from 'react';
import styles from './trainingProcessing.module.scss';
import { ProgramFull } from '../../../../../../types/training';
import { useForm } from 'react-hook-form';
import {getText, getUserId} from "../../../../../../store/selectors";
import {useAppSelector} from "../../../../../hooks/redux";
import {completeDay, fetchDrafts, saveDraft} from "../../../../../../lib/trainingData";
import Preloader from "../../../../../../ui/preloader/Preloader";

interface ProgramDaysListTypes {
    program: ProgramFull;
    activeTab: number;
    onComplete: () => void;
    isMyProgram: boolean,
}

type FormValues = {
    [exerciseId: string]: string;
};

const TrainingProcessing = ({ program, activeTab, onComplete, isMyProgram }: ProgramDaysListTypes) => {
    const { training } = useAppSelector(getText);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const userId = useAppSelector(getUserId);
    const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
    const [dates, setDates] = useState<Record<number, string>>({});
    const [submittedDays, setSubmittedDays] = useState<Record<number, boolean>>({});
    // Subscribes to every registered field (no argument), so this
    // re-renders -- and the Complete button's disabled state below
    // updates -- on every keystroke, not just on blur/submit.
    const watchedValues = watch();

    const hasAnyValueForDay = (dayIndex: number): boolean =>
        program.days[dayIndex].exercises.some(
            (exercise) => (watchedValues[exercise.programExerciseId] ?? '').trim().length > 0,
        );


    useEffect(() => {
        const loadDrafts = async () => {
            if (!userId) return;

            const allIds = program.days.flatMap(day => day.exercises.map(e => e.programExerciseId));
            const drafts = await fetchDrafts(userId, allIds);

            for (const [programExerciseId, value] of Object.entries(drafts)) {
                setValue(programExerciseId, value);
            }
        };

        loadDrafts();
    }, [userId, program, setValue]);


    const onSubmitDay = async (dayIndex: number, dayId: string) => {
        const date = dates[dayIndex];
        if (!userId || !date || !hasAnyValueForDay(dayIndex)) return;
        setIsPreloader(true);
        const success = await completeDay(userId, dayId, date);
        if (success) {
            setSubmittedDays((prev) => ({ ...prev, [dayIndex]: true }));
            program.days[dayIndex].exercises.forEach((exercise) => {
                setValue(exercise.programExerciseId, '');
            });
            setDates((prev) => ({ ...prev, [dayIndex]: '' }));
            onComplete();
            setIsPreloader(false);
        }
    };


    return (
        <div className={styles.process}>
            {program.days.map((day, index) => (
                <ul key={index}>
                    <input
                        type="date"
                        className={styles.process__date}
                        value={dates[index] || ''}
                        onChange={(e) => setDates((prev) => ({ ...prev, [index]: e.target.value }))}
                    />

                    {day.exercises.map((exercise, idx) => (
                        <li key={exercise.programExerciseId} className={activeTab === 1 ? styles.bigField : ''}>
                            <input
                                className={styles.input}
                                style={activeTab === 1 ? { height: '30px' } : undefined}
                                placeholder="XXX/YYxZ"
                                {...register(exercise.programExerciseId)}
                                onBlur={(e) => {
                                    if (!userId) return;
                                    saveDraft(userId, exercise.programExerciseId, day.id, e.target.value);
                                }}
                            />
                        </li>
                    ))}

                    <div className={styles.processActions}>
                        {isMyProgram && (
                            <button
                                type="button"
                                className={'button'}
                                onClick={() => onSubmitDay(index, day.id)}
                                disabled={submittedDays[index] || !dates[index] || !hasAnyValueForDay(index)}
                            >
                                <span>{training.complete}</span>
                            </button>
                        )}
                    </div>
                </ul>
            ))}

            {isPreloader && <Preloader />}
        </div>
    );
};

export default TrainingProcessing;
