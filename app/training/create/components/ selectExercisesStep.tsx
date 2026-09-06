'use client';

import React, { useState } from 'react';
import styles from './create.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import ExercisesChooser from './exercisesChooser';
import { ProgramFull } from '../../../../types/training';

const MIN_SETS = 1;
const MAX_SETS = 7;
const SETS_OPTIONS = Array.from({ length: MAX_SETS - MIN_SETS + 1 }, (_, i) => MIN_SETS + i);

interface Props {
    days: { dayNumber: number; exercises: { exerciseId: string; sets: number }[] }[];
    onUpdateDay: (
        dayIndex: number,
        exercises: { exerciseId: string; sets: number }[],
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
    const { training, base } = useAppSelector(getText);
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
    // Mirrors mobile's own `isEditMode ? saveChanges : createTitle` switch
    // on this same final-step button -- web always said "Create" here,
    // even when editing an existing program.
    const isEdit = Boolean(initialProgram);

    const handleEditClick = (index: number) => {
        setCurrentDayIndex(index);
        setIsShowPopup(true);
    };

    const handleSelect = (
        selected: string[],
        map: Record<string, { name: string; image: string }>
    ) => {
        if (currentDayIndex !== null) {
            // Preserves each kept exercise's already-configured `sets`;
            // newly-selected exercises default to 3 -- mirrors mobile's
            // exercise-picker.tsx `handleConfirm` exactly.
            const existingSetsByExerciseId = new Map(
                days[currentDayIndex].exercises.map((slot) => [slot.exerciseId, slot.sets])
            );
            const exercises = selected.map((exerciseId) => ({
                exerciseId,
                sets: existingSetsByExerciseId.get(exerciseId) ?? 3,
            }));
            onUpdateDay(currentDayIndex, exercises, map);
            setIsShowPopup(false);
        }
    };

    const handleSetsChange = (dayIndex: number, exerciseId: string, sets: number) => {
        const updated = days[dayIndex].exercises.map((slot) =>
            slot.exerciseId === exerciseId ? { ...slot, sets } : slot
        );
        onUpdateDay(dayIndex, updated, exerciseMap);
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
                                    {day.exercises.map((slot, indexEx) => (
                                        <li
                                            key={`${slot.exerciseId}-${indexEx}`}
                                            className={`${styles.exerciseRow} ${
                                                !exerciseMap[slot.exerciseId] ? styles.unknownExercise : ''
                                            }`}
                                        >
                                            <span className={styles.exerciseRowName}>
                                                <span>{indexEx + 1}. </span>
                                                {exerciseMap[slot.exerciseId]?.name || `Unknown (${slot.exerciseId})`}
                                            </span>
                                            <select
                                                className={styles.setsSelect}
                                                value={slot.sets}
                                                onChange={(e) =>
                                                    handleSetsChange(index, slot.exerciseId, Number(e.target.value))
                                                }
                                            >
                                                {SETS_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>
                                                        ×{option}
                                                    </option>
                                                ))}
                                            </select>
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
                {/* `() => onNext()`, not `onClick={onNext}` -- `onNext` is
                    `handleSave` here (`CreateEditProgram.tsx`), and `onClick`
                    passing the raw click event as its `titleOverride`
                    argument would corrupt the save (or the create -- this
                    button is shared by both modes) with a DOM event instead
                    of the actual title. Same bug class as the per-step Save
                    buttons above (`programTypeStep.tsx` etc). */}
                <button onClick={() => onNext()} className="submit" disabled={!isValid}>
                    {isEdit ? base.save : training.create}
                </button>
            </div>

            {isShowPopup && currentDayIndex !== null && (
                <ExercisesChooser
                    setIsShowPopup={setIsShowPopup}
                    selectedDefault={days[currentDayIndex]?.exercises?.map((slot) => slot.exerciseId) ?? []}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
};

export default SelectExercisesStep;
