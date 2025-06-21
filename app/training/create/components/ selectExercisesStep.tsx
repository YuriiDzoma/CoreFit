'use client';

import React, { useState } from 'react';
import styles from './create.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import ExercisesChooser from './exercisesChooser';
import { ProgramFull } from '../../../../types/training';

interface Props {
    days: { dayNumber: number; exercises: string[] }[];
    onUpdateDay: (
        dayIndex: number,
        exercises: string[],
        map: Record<string, { name: string; image: string }>
    ) => void;
    onBack: () => void;
    onNext: () => void;
    exerciseMap: Record<string, { name: string; image: string }>;
    isValid: boolean;
    initialProgram?: ProgramFull;
}

const SelectExercisesStep: React.FC<Props> = ({
                                                  days,
                                                  onUpdateDay,
                                                  onBack,
                                                  onNext,
                                                  exerciseMap,
                                                  isValid,
                                                  initialProgram
                                              }) => {
    const { training } = useAppSelector(getText);
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

    const handleEditClick = (index: number) => {
        setCurrentDayIndex(index);
        setIsShowPopup(true);
    };

    const handleSelect = (
        selected: string[],
        map: Record<string, { name: string; image: string }>
    ) => {
        if (currentDayIndex !== null) {
            onUpdateDay(currentDayIndex, selected, map);
            setIsShowPopup(false);
        }
    };

    return (
        <div className={styles.exercisesStep}>
            <h3 className={styles.create__title}>{training.exercises}</h3>

            <div className={styles.daysWrapper}>
                {Array.isArray(days) &&
                days.map((day, index) => {
                    const hasExercises = day.exercises.length > 0;

                    return (
                        <div className={styles.dayBlock} key={day.dayNumber}>
                            <h4>{`${training.day} ${day.dayNumber}`}</h4>

                            {hasExercises && (
                                <ul className={styles.exerciseList}>
                                    {day.exercises.map((exId, indexEx) => (
                                        <li
                                            key={`${exId}-${indexEx}`}
                                            className={
                                                !exerciseMap[exId] ? styles.unknownExercise : ''
                                            }
                                        >
                                            <span>{indexEx + 1}. </span>
                                            {exerciseMap[exId]?.name || `Unknown (${exId})`}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button className="button" onClick={() => handleEditClick(index)}>
                                {hasExercises
                                    ? training.editExercises
                                    : training.addExercises}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className={styles.actions}>
                <button onClick={onBack} className="submit">
                    {training.back}
                </button>
                <button onClick={onNext} className="submit" disabled={!isValid}>
                    {training.create}
                </button>
            </div>

            {isShowPopup && currentDayIndex !== null && (
                <ExercisesChooser
                    setIsShowPopup={setIsShowPopup}
                    selectedDefault={
                        days[currentDayIndex]?.exercises?.filter(
                            (id): id is string => typeof id === 'string'
                        ) ?? []
                    }
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
};

export default SelectExercisesStep;
