'use client';

import React from 'react';
import styles from './trainingHistory.module.scss';
import {ProgramFull} from '@/types/training';

type HistoryRecord = {
    id?: string;
    date: string;
    created_at?: string | null;
    values: Record<string, string>;
};

type HistoryMap = Record<string, HistoryRecord[]>;

interface Props {
    program: ProgramFull;
    activeTab: number;
    history: HistoryMap;
}

const TrainingHistory: React.FC<Props> = ({
                                              program,
                                              activeTab,
                                              history,
                                          }) => {
    return (
        <div
            className={styles.trainingHistory}
            style={activeTab === 1 ? {rowGap: '38px'} : undefined}
        >
            {program.days.map((day) => {
                const records = history[day.id] || [];

                return (
                    <div key={day.id} className={styles.historyBlock}>
                        <ul className={styles.exerciseRows}>
                            <div
                                className={styles.dateRow}
                                style={activeTab === 1 ? {height: '32px'} : undefined}
                            >
                                {records.length > 0 ? (
                                    records.map((record, index) => (
                                        <span
                                            key={`${record.date}-${record.created_at || index}`}
                                            className={styles.dateCell}
                                        >
                                            {new Date(record.date).toLocaleDateString('uk-UA', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit',
                                            })}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.dateCell}/>
                                )}
                            </div>

                            {day.exercises.map((exercise) => (
                                <li
                                    key={exercise.programExerciseId}
                                    className={
                                        activeTab === 1
                                            ? `${styles.exerciseRow} ${styles.bigField}`
                                            : styles.exerciseRow
                                    }
                                >
                                    {records.length > 0 ? (
                                        records.map((record, index) => (
                                            <p
                                                key={`${exercise.programExerciseId}-${record.date}-${record.created_at || index}`}
                                                className={styles.valueCell}
                                            >
                                                <span>
                                                    {record.values[exercise.programExerciseId] || ''}
                                                </span>
                                            </p>
                                        ))
                                    ) : (
                                        <span className={styles.valueCell}/>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default TrainingHistory;