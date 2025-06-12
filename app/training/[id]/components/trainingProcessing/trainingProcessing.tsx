'use client';

import React, { useState } from 'react';
import styles from './trainingProcessing.module.scss';
import { ProgramFull } from '../../../../../types/training';
import { useForm } from 'react-hook-form';
import { saveTrainingResult } from '@/lib/trainingData';
import {getUserId} from "../../../../../store/selectors";
import {useAppSelector} from "../../../../hooks/redux";

interface ProgramDaysListTypes {
    program: ProgramFull;
    activeTab: number;
}

type FormValues = {
    [exerciseId: string]: string;
};

const TrainingProcessing = ({ program, activeTab }: ProgramDaysListTypes) => {
    const userId = useAppSelector(getUserId);
    const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
    const [dates, setDates] = useState<Record<number, string>>({});
    const [submittedDays, setSubmittedDays] = useState<Record<number, boolean>>({});

    const onSubmitDay = async (dayIndex: number, dayId: string, exerciseIds: string[]) => {
        const formValues = watch();
        const filtered: Record<string, string> = {};

        exerciseIds.forEach((id) => {
            if (formValues[id]?.trim()) {
                filtered[id] = formValues[id];
            }
        });

        const date = dates[dayIndex];
        if (!userId || !date || Object.keys(filtered).length === 0) return;

        const success = await saveTrainingResult(userId, dayId, date, filtered);


        if (success) {
            setSubmittedDays((prev) => ({ ...prev, [dayIndex]: true }));
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

                    {day.exercises.map((exId, idx) => (
                        <li key={exId} className={activeTab === 1 ? styles.bigField : ''}>
                            <input
                                className={styles.input}
                                style={activeTab === 1 ? { height: '30px' } : undefined}
                                placeholder="XXX/YYxZ"
                                {...register(exId)}
                            />
                        </li>
                    ))}

                    <div className={styles.processActions}>
                        <button
                            type="button"
                            className={'button'}
                            onClick={() => onSubmitDay(index, day.id, day.exercises)}
                            disabled={submittedDays[index]}
                        >
                            <span>Complete</span>
                        </button>
                    </div>
                </ul>
            ))}
        </div>
    );
};

export default TrainingProcessing;
