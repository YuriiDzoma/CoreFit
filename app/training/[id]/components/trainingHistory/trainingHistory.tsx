'use client';

import React, {useEffect, useState} from 'react';
import styles from './trainingHistory.module.scss';
import {ProgramFull} from '@/types/training';
import {fetchTrainingHistory} from '@/lib/trainingData';

interface Props {
    program: ProgramFull;
    activeTab: number,
}

type HistoryMap = Record<string, { date: string; values: Record<string, string> }[]>;

const TrainingHistory: React.FC<Props> = ({program, activeTab}) => {
    const [history, setHistory] = useState<HistoryMap>({});

    useEffect(() => {
        const loadAll = async () => {
            const map: HistoryMap = {};
            for (const day of program.days) {
                const data = await fetchTrainingHistory(day.id);
                console.log(data)
                map[day.id] = data;
            }
            setHistory(map);
        };
        loadAll();
    }, [program]);

    return (
        <div className={styles.trainingHistory}>
            {program.days.map((day, idx) => {
                const records = [...(history[day.id] || [])].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );


                return (
                    <div key={day.id} className={styles.historyBlock}>
                        <ul className={styles.exerciseRows}>
                            <div className={styles.dateRow}>
                                {records.length > 0
                                    ? records.map((record, i) => (
                                        <span key={i} className={styles.dateCell}>
                                  {new Date(record.date).toLocaleDateString('uk-UA', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: '2-digit',
                                  })}
                              </span>
                                    )) : (<span className={styles.dateCell}/>)}
                            </div>

                            {day.exercises.map((exId, exIdx) => (
                                <li
                                    key={exId}
                                    className={activeTab === 1
                                        ? `${styles.exerciseRow} ${styles.bigField}`
                                        : styles.exerciseRow}
                                >

                                    {records.length > 0
                                        ? records.map((record, i) => (
                                            <p key={i} className={styles.valueCell}>
                                                <span>{record.values[exId] || ''}</span>
                                            </p>
                                        ))
                                        : (
                                            <span className={styles.valueCell}/>
                                        )
                                    }
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
