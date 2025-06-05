'use client';

import React, { useState } from 'react';
import styles from './create.module.scss';
import ProgramNameStep from "./programNameStep";
import ProgramTypeStep from "./programTypeStep";
import {DifficultyLevelStep} from "./difficultyLevelStep";
import Stepper from "./stepper";
import {DaysCountStep} from "./daysCountStep";

const CreateProgram = () => {
    const [step, setStep] = useState(1);
    const [programName, setProgramName] = useState('');
    const [programType, setProgramType] = useState<'aerobic' | 'anaerobic' | 'crossfit' | ''>('');
    const [difficulty, setDifficulty] = useState(1);
    const [daysCount, setDaysCount] = useState(1);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

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
                    onChange={setDaysCount}
                    onBack={handleBack}
                    onNext={() => {
                        // TODO: go to step with selecting exercises
                    }}
                />
            )}
        </div>
    );
};

export default CreateProgram;
