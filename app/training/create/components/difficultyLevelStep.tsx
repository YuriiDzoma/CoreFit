import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './create.module.scss';
import './create.scss';
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";

interface Props {
    value: number;
    onChange: (value: number) => void;
    onNext: () => void;
    onBack: () => void;
}



export const DifficultyLevelStep: React.FC<Props> = ({ value, onChange, onNext, onBack }) => {
    const { training } = useAppSelector(getText);

    const marks = [
        { value: 1, label: training.beginner },
        { value: 2, label: training.intermediate },
        { value: 3, label: training.advanced },
        { value: 4, label: training.expert },
        { value: 5, label: training.professional },
    ];

    return (
        <div className={styles.difficulty}>
            <h3 className={styles.create__title}>{training.selectDifficulty}</h3>
            <div className={styles.difficulty__content}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        height: 260,
                        gap: 4,
                        padding: '16px 0'
                    }}
                >
                    <Slider
                        value={value}
                        onChange={(e, val) => onChange(val as number)}
                        orientation="vertical"
                        min={1}
                        max={5}
                        step={1}
                        marks={marks}
                        sx={{ height: '260' }}
                    />
                </Box>
                <p className={styles.difficulty__value}>{marks[value - 1].label}</p>
            </div>
            <div className={styles.actions}>
                <button className={'submit'} onClick={onBack}>{training.back}</button>
                <button className={'submit'} onClick={onNext}>{training.next}</button>
            </div>
        </div>
    );
};