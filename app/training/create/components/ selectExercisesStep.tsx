'use client';

import React, {useMemo, useState} from 'react';
import styles from './create.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import ExercisesChooser from "./exercisesChooser";

interface Props {
    days: { dayNumber: number; exercises: string[] }[];
    onUpdateDay: (dayIndex: number, exercises: string[], map: Record<string, string>) => void;
    onBack: () => void;
    onNext: () => void;
    exerciseMap: Record<string, string>;
    isValid: boolean;
}


const SelectExercisesStep: React.FC<Props> = ({
                                                  days,
                                                  onUpdateDay,
                                                  onBack,
                                                  onNext,
                                                  exerciseMap,
                                                  isValid
                                              }) => {
    const { training } = useAppSelector(getText);
    const [isShowPopup, setIsShowPopup] = useState<boolean>(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);


    return (
        <div className={styles.exercisesStep}>
            <h3 className={styles.create__title}>{training.exercises}</h3>

            <div className={styles.daysWrapper}>
                {days.map((day, index) => {
                    const hasExercises = day.exercises.length > 0;

                    return (
                        <div className={styles.dayBlock} key={day.dayNumber}>
                            <h4>{`${training.day} ${day.dayNumber}`}</h4>

                            {hasExercises && (
                                <ul className={styles.exerciseList}>
                                    {day.exercises.map((exId, indexEx) => (
                                        <li key={exId}><span>{indexEx + 1}. </span>{exerciseMap[exId] || exId}</li>
                                    ))}
                                </ul>
                            )}
                            <button
                                className={'button'}
                                onClick={() => {
                                    setCurrentDayIndex(index);
                                    setIsShowPopup(true);
                                }}
                            >
                                {hasExercises ? training.editExercises : training.addExercises}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className={styles.actions}>
                <button onClick={onBack} className={'submit'}>
                    {training.back}
                </button>
                <button onClick={onNext} className={'submit'} disabled={!isValid}>
                    {training.create}
                </button>

            </div>

            {isShowPopup && currentDayIndex !== null && (
                <ExercisesChooser
                    setIsShowPopup={setIsShowPopup}
                    selectedDefault={days[currentDayIndex].exercises} // ⬅️ Передаємо існуючі вправи
                    onSelect={(selected: string[], map: Record<string, string>) => {
                        onUpdateDay(currentDayIndex as number, selected, map);
                        setIsShowPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default SelectExercisesStep;
