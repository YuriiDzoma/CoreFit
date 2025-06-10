import React from "react";
import styles from './TrainingProcessing.module.scss';
import {ProgramFull} from "../../../../../types/training";

interface ProgramDaysListTypes {
    program: ProgramFull;
    results: Record<string, string>;
    setResults: (r: Record<string, string>) => void;
}


const TrainingProcessing = ({program, results, setResults}: ProgramDaysListTypes) => {
    return (
        <div className={styles.process}>
            {program.days.map((day, index) => (
                <ul key={index}>
                    <input type="date" className={styles.process__date}/>
                    {day.exercises.map((exId, idx) => (
                        <li key={exId}>
                            <input
                                className={styles.input}
                                value={results[exId] || ''}
                                placeholder=""
                                onChange={(e) => {
                                    setResults({...results, [exId]: e.target.value});
                                }}
                            />
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    )
}

export default TrainingProcessing;