'use client';

import React, {useEffect, useRef} from 'react';
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
    // Each day's `.historyBlock` scrolls horizontally on its own now (was
    // one shared container across every day -- scrolling to see an older
    // entry on one day used to drag every other day's columns along with
    // it). Oldest-first, per day -- the most recent entry is meant to read
    // as the last, rightmost column. Completing a day refetches `history`
    // and appends a new column at the end for *that* day, but a browser
    // never resets an element's own scroll position just because its
    // content changed -- if that day's block wasn't already scrolled all
    // the way right, the freshly-added column landed off-screen, making
    // the update look like it silently didn't happen. Jumping every
    // block's own scroll to its end on every `history` change is what
    // actually surfaces it, without touching any other day's scroll state.
    const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        for (const el of Object.values(blockRefs.current)) {
            if (el) el.scrollLeft = el.scrollWidth;
        }
    }, [history]);

    return (
        <div
            className={styles.trainingHistory}
            style={activeTab === 1 ? {rowGap: '38px'} : undefined}
        >
            {program.days.map((day) => {
                const records = history[day.id] || [];

                return (
                    <div
                        key={day.id}
                        ref={(el) => {
                            blockRefs.current[day.id] = el;
                        }}
                        className={styles.historyBlock}
                    >
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