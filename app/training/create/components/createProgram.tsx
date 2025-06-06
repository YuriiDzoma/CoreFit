'use client';

import React, { useState } from 'react';
import styles from './create.module.scss';
import ProgramNameStep from './programNameStep';
import ProgramTypeStep from './programTypeStep';
import { DifficultyLevelStep } from './difficultyLevelStep';
import Stepper from './stepper';
import { DaysCountStep } from './daysCountStep';
import SelectExercisesStep from "./ selectExercisesStep";
import { createTrainingProgram } from '@/lib/trainingData';
import { useAppSelector } from '@/app/hooks/redux';
import { getUserId } from '@/store/selectors';
import Preloader from "../../../../ui/preloader/Preloader";
import {useRouter} from "next/navigation";

const CreateProgram = () => {
    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const [step, setStep] = useState(1);
    const [programName, setProgramName] = useState('');
    const [programType, setProgramType] = useState<'aerobic' | 'anaerobic' | 'crossfit' | ''>('');
    const [difficulty, setDifficulty] = useState(1);
    const [daysCount, setDaysCount] = useState(1);
    const [programDays, setProgramDays] = useState<{ dayNumber: number; exercises: string[] }[]>(
        Array.from({ length: daysCount }, (_, i) => ({
            dayNumber: i + 1,
            exercises: [],
        }))
    );
    const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({});
    const isValidProgram = programDays.every((day) => day.exercises.length > 0);
    const levelMap = ['beginner', 'intermediate', 'advanced', 'expert', 'professional'];
    const userId = useAppSelector(getUserId);
    const router = useRouter();

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);


    const handleDayExercisesUpdate = (
        dayIndex: number,
        exercises: string[],
        newMap: Record<string, string>
    ) => {
        setProgramDays((prev) =>
            prev.map((day, index) =>
                index === dayIndex ? { ...day, exercises } : day
            )
        );

        setExerciseMap((prevMap) => ({
            ...prevMap,
            ...newMap,
        }));
    };


    const onCreate = async () => {
        if (!userId) return;
        setIsPreloader(true);
        const level = levelMap[difficulty - 1];

        const result = await createTrainingProgram(
            userId,
            programName,
            programType,
            level,
            programDays
        );

        if (result) {
            setIsPreloader(false);
            router.push('/training');

        } else {
            setIsPreloader(false);
            console.log('ERROR')
        }
    };


    return (
        <div className={styles.wrapper}>
            <h2 className={'title'}>Create Training Program</h2>
            <Stepper activeStep={step} />

            {step === 1 && (
                <ProgramNameStep
                    value={programName}
                    onChange={setProgramName}
                    onNext={handleNext}
                />
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
                        setProgramDays(
                            Array.from({ length: val }, (_, i) => ({
                                dayNumber: i + 1,
                                exercises: [],
                            }))
                        );
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
                    onNext={onCreate}
                    isValid={isValidProgram}
                />
            )}

            {isPreloader && <Preloader />}
        </div>
    );
};

export default CreateProgram;
