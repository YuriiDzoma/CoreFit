'use client';

import React, { useEffect, useState } from 'react';
import styles from './create.module.scss';
import ProgramNameStep from './programNameStep';
import ProgramTypeStep from './programTypeStep';
import { DifficultyLevelStep } from './difficultyLevelStep';
import Stepper from './stepper';
import { DaysCountStep } from './daysCountStep';
import SelectExercisesStep from './ selectExercisesStep';
import Preloader from '../../../../ui/preloader/Preloader';
import {useRouter, useSearchParams} from 'next/navigation';
import { useAppSelector } from '@/app/hooks/redux';
import { getUserId, getLanguage, getText } from '@/store/selectors';
import { ProgramFull } from '@/types/training';
import {
    createTrainingProgram,
    updateTrainingProgram,
    fetchExercisesByIds
} from '@/lib/trainingData';
import {createGlobalProgram} from "../../../../lib/complexesData";
import GlobalPopup from "@/app/components/globalPopup/globalPopup";

type EditableProgramDay = {
    dayNumber: number;
    exercises: string[];
};

interface Props {
    initialProgram?: ProgramFull;
}

const allowedTypes = ['aerobic', 'anaerobic', 'crossfit'] as const;
type AllowedType = (typeof allowedTypes)[number];

const CreateEditProgram = ({ initialProgram }: Props) => {
    const searchParams = useSearchParams();
    const isGlobal = searchParams.get("global") === "1";

    const userId = useAppSelector(getUserId);
    const language = useAppSelector(getLanguage);
    const { training } = useAppSelector(getText);
    const router = useRouter();
    const [isPreloader, setIsPreloader] = useState(false);
    const [step, setStep] = useState(1);

    const levelMap = ['beginner', 'intermediate', 'advanced', 'expert', 'professional'];
    const isEdit = Boolean(initialProgram);

    const [programName, setProgramName] = useState<string>(initialProgram?.title || '');

    const initialType: AllowedType | '' =
        initialProgram && allowedTypes.includes(initialProgram.type as AllowedType)
            ? (initialProgram.type as AllowedType)
            : '';

    const [programType, setProgramType] = useState<AllowedType | ''>(initialType);

    const [difficulty, setDifficulty] = useState(() =>
        initialProgram ? levelMap.indexOf(initialProgram.level) + 1 : 1
    );

    const [daysCount, setDaysCount] = useState(initialProgram?.days.length || 1);

    const [programDays, setProgramDays] = useState<EditableProgramDay[]>(() => {
        if (initialProgram?.days) {
            return initialProgram.days.map((day) => ({
                dayNumber: day.day_number,
                exercises: day.exercises.map((ex) => ex.id),
            }));
        }

        return Array.from({ length: 1 }, (_, i) => ({
            dayNumber: i + 1,
            exercises: [],
        }));
    });

    const [exerciseMap, setExerciseMap] = useState<
        Record<string, { name: string; image: string }>
        >({});

    const isValidProgram = programDays.every((day) => day.exercises.length > 0);


    useEffect(() => {
        const loadExerciseMap = async () => {
            const allIds = programDays.flatMap((d) => d.exercises);
            const uniqueIds = Array.from(new Set(allIds)).filter((id) => !!id);

            if (uniqueIds.length === 0) return;

            const lang = language === 'ua' ? 'ukr' : language;
            const exerciseMapData = await fetchExercisesByIds(uniqueIds, lang as 'eng' | 'ukr' | 'rus');

            setExerciseMap((prev) => ({ ...prev, ...exerciseMapData }));
        };

        loadExerciseMap();
    }, [JSON.stringify(programDays), language]); // ✅ стабільна перевірка змін

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleDayExercisesUpdate = (
        dayIndex: number,
        exercises: string[],
        newMap: Record<string, { name: string; image: string }>
    ) => {
        setProgramDays((prev) =>
            prev.map((day, index) => (index === dayIndex ? { ...day, exercises } : day))
        );
        setExerciseMap((prevMap) => ({ ...prevMap, ...newMap }));
    };

    // Days beyond the new count, and exercises unchecked from a kept day,
    // both cascade-delete their training_history/exercise_logs rows on
    // save (program_days/program_exercises FKs -- confirmed live via
    // pg_constraint). Only relevant on edit; a brand-new program has
    // nothing to lose yet.
    const computeRemovalSummary = (): string | null => {
        if (!isEdit || !initialProgram) return null;

        const keptDayNumbers = new Set(programDays.map((d) => d.dayNumber));
        const removedDays = initialProgram.days.filter((d) => !keptDayNumbers.has(d.day_number));
        const removedDayNumbers = new Set(removedDays.map((d) => d.day_number));

        let removedExercisesCount = 0;
        for (const day of initialProgram.days) {
            if (removedDayNumbers.has(day.day_number)) continue;
            const newDay = programDays.find((d) => d.dayNumber === day.day_number);
            if (!newDay) continue;
            const keptExerciseIds = new Set(newDay.exercises);
            removedExercisesCount += day.exercises.filter((ex) => !keptExerciseIds.has(ex.id)).length;
        }

        const parts: string[] = [];
        if (removedDays.length > 0) parts.push(`${removedDays.length} ${training.days.toLowerCase()}`);
        if (removedExercisesCount > 0) parts.push(`${removedExercisesCount} ${training.exercises.toLowerCase()}`);

        return parts.length > 0 ? parts.join(', ') : null;
    };

    const [pendingRemovalSummary, setPendingRemovalSummary] = useState<string | null>(null);

    const handleSave = async () => {
        if (!userId) return;

        const summary = computeRemovalSummary();
        if (summary) {
            setPendingRemovalSummary(summary);
            return;
        }

        await performSave();
    };

    const performSave = async () => {
        if (!userId) return;

        setPendingRemovalSummary(null);
        setIsPreloader(true);
        const level = levelMap[difficulty - 1];

        let success: string | boolean | null;

        if (isGlobal) {
            // ✅ створення глобальної програми
            success = await createGlobalProgram(
                programName,
                programType,
                level,
                programDays,
            );
        } else if (isEdit && initialProgram) {
            // ✅ редагування існуючої програми (той самий id, не дублікат)
            success = await updateTrainingProgram(
                initialProgram.id,
                programName,
                programType,
                level,
                programDays
            );
        } else {
            // ✅ створення особистої програми
            success = await createTrainingProgram(
                userId!,
                programName,
                programType,
                level,
                programDays
            );
        }

        if (success) {
            await new Promise((resolve) => setTimeout(resolve, 150));
            router.push(isGlobal ? '/training/complexes' : '/training');
        } else {
            console.error('Failed to save program');
            setIsPreloader(false);
        }

    };


    return (
        <div className={styles.wrapper}>
            <h2 className="title">
                {isEdit ? training.editTrainingProgram : training.createTrainingProgram}
            </h2>
            <Stepper activeStep={step} />

            {step === 1 && (
                <ProgramNameStep value={programName} onChange={setProgramName} onNext={handleNext} />
            )}
            {step === 2 && (
                <ProgramTypeStep
                    value={programType}
                    onChange={setProgramType}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 3 && (
                <DifficultyLevelStep
                    value={difficulty}
                    onChange={setDifficulty}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 4 && (
                <DaysCountStep
                    value={daysCount}
                    onChange={(val) => {
                        setDaysCount(val);
                        setProgramDays((prev) => {
                            const updated = Array.from({ length: val }, (_, i) => {
                                const existing = prev.find((d) => d.dayNumber === i + 1);
                                return existing
                                    ? existing
                                    : { dayNumber: i + 1, exercises: [] };
                            });
                            return updated;
                        });
                    }}

                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 5 && (
                <SelectExercisesStep
                    days={programDays}
                    onUpdateDay={handleDayExercisesUpdate}
                    exerciseMap={exerciseMap}
                    onBack={handleBack}
                    onNext={handleSave}
                    initialProgram={initialProgram}
                    isValid={isValidProgram}
                />
            )}

            {pendingRemovalSummary && (
                <GlobalPopup
                    title={training.confirmRemovalTitle}
                    message={training.confirmRemovalBody.replace('{value}', pendingRemovalSummary)}
                    onConfirm={performSave}
                    onCancel={() => setPendingRemovalSummary(null)}
                />
            )}

            {isPreloader && <Preloader />}
        </div>
    );
};

export default CreateEditProgram;
