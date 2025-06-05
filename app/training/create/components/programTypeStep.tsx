import React from 'react';
import styles from './create.module.scss';
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme, getText} from "../../../../store/selectors";

interface ProgramTypeStepProps {
    value: 'aerobic' | 'anaerobic' | 'crossfit' | '';
    onChange: (value: 'aerobic' | 'anaerobic' | 'crossfit') => void;
    onNext: () => void;
    onBack: () => void;
}

const options: { label: string; value: 'aerobic' | 'anaerobic' | 'crossfit' }[] = [
    { label: 'Aerobic', value: 'aerobic' },
    { label: 'Anaerobic', value: 'anaerobic' },
    { label: 'Crossfit', value: 'crossfit' },
];


const ProgramTypeStep: React.FC<ProgramTypeStepProps> = ({ value, onChange, onNext, onBack }) => {
    const { training } = useAppSelector(getText);
    const isDark = useAppSelector(getIsDarkTheme);

    return (
        <div className={styles.type}>
            <h3 className={styles.title}>{training.selectType}</h3>
            <div className={styles.type__info}>
                <span>{training.aerobicInfo}</span>
                <span>{training.anaerobicInfo}</span>
                <span>{training.crossfitInfo}</span>
            </div>
            <div className={styles.type__changer}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        style={value === opt.value && !isDark ? {color: '#fff'} : undefined}
                        className={value === opt.value ? `${styles.active} button` : 'button'}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            <div className={styles.actions}>
                <button onClick={onBack} className={'submit'}>
                    Back
                </button>
                <button onClick={onNext} disabled={!value} className={'submit'}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProgramTypeStep;
