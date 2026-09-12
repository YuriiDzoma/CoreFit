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

// Constrains the weight/reps input to what the stored value format
// ("weight/reps", `x{sets}` appended separately at save time) actually
// needs: digits, "/", and "." (decimal weights like "27.5/10" are real,
// existing data). "\" and space are normalized to "/" and "," to "."
// rather than just stripped, since those are the most likely typos/IME
// substitutions for the intended character, not garbage input.
function sanitizeWeightRepsValue(text: string): string {
    return text
        .replace(/,/g, '.')
        .replace(/[\\ ]/g, '/')
        .replace(/[^0-9./]/g, '');
}

// Matches TrainingHistory's own date formatting (`trainingHistory.tsx`) --
// always uk-UA numeric, regardless of the active UI language, for the same
// reason that one is: a consistent short date shape everywhere on this
// page, not a per-language format.
function formatDateValue(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
}

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
                    {/* iOS Safari's native date control renders blank below
                        ~140px -- doesn't shrink or wrap its own text/icon
                        to fit a narrower box, it just stops drawing them.
                        The input itself stays real and fully interactive
                        (still holds the actual value/focus) but invisible;
                        this label renders our own compact text over it
                        instead, so the visible width is no longer bounded
                        by whatever iOS needs internally. The label is a
                        normal (not pointer-events: none) click target
                        itself, calling showPicker() on the real input via
                        this wrapper's onClick -- a native date input only
                        opens its own picker automatically when the click
                        lands on its small calendar icon specifically
                        (clicking the text/segment area just focuses a
                        segment for typing), and since the whole visible
                        area here is our label rather than the input's real
                        icon, forcing showPicker() ourselves is what makes a
                        tap anywhere in the field open it. */}
                    <div
                        className={styles.dateField}
                        onClick={(e) => {
                            const input = e.currentTarget.querySelector('input[type="date"]');
                            if (!(input instanceof HTMLInputElement)) return;
                            try {
                                input.showPicker();
                            } catch {
                                // showPicker() can refuse (e.g. a browser
                                // that doesn't support it, or one stricter
                                // about what counts as a user gesture) --
                                // falling back to focus still beats a
                                // thrown error breaking the click entirely.
                                input.focus();
                            }
                        }}
                    >
                        <input
                            type="date"
                            className={styles.process__date}
                            value={dates[index] || ''}
                            onChange={(e) => setDates((prev) => ({ ...prev, [index]: e.target.value }))}
                        />
                        <span className={styles.dateField__label}>
                            {dates[index] ? formatDateValue(dates[index]) : training.datePlaceholder}
                        </span>
                    </div>

                    {day.exercises.map((exercise, idx) => (
                        <li
                            key={exercise.programExerciseId}
                            className={`${styles.valueRow} ${activeTab === 1 ? styles.bigField : ''}`}
                        >
                            <input
                                className={styles.input}
                                style={activeTab === 1 ? { height: '30px' } : undefined}
                                placeholder="XXX/YY"
                                {...register(exercise.programExerciseId, {
                                    onChange: (e) => {
                                        e.target.value = sanitizeWeightRepsValue(e.target.value);
                                    },
                                })}
                                onBlur={(e) => {
                                    if (!userId) return;
                                    saveDraft(userId, exercise.programExerciseId, day.id, e.target.value);
                                }}
                            />
                            <span className={styles.setsLabel}>×{exercise.sets}</span>
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
