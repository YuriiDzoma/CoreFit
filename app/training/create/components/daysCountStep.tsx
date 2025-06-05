import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import styles from './create.module.scss';
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";

interface Props {
    value: number;
    onChange: (value: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export const DaysCountStep: React.FC<Props> = ({ value, onChange, onNext, onBack }) => {
    const { training } = useAppSelector(getText);

    const marks = [
        { value: 1, label: `1 ${training.day}`, description: `1-${training.generalTraining}`},
        { value: 2, label: `2 ${training.days}`, description: `2-${training.splitTraining}`},
        { value: 3, label: `3 ${training.days}`, description: `3-${training.splitTraining}`},
        { value: 4, label: `4 ${training.days}`, description: `4-${training.splitTraining}`},
        { value: 5, label: `5 ${training.days}`, description: `5-${training.splitTraining}`},
        { value: 6, label: `6 ${training.days}`, description: `6-${training.splitTraining}`},
        { value: 7, label: `7 ${training.days}`, description: `7-${training.splitTraining}`},
    ];

    return (
        <div className={styles.days}>
            <h3 className={styles.create__title}>{training.changeDay}</h3>
            {/*<Box sx={{ width: '100%', maxWidth: 400, margin: '20px auto' }}>*/}
            {/*    <Slider*/}
            {/*        aria-label="DaysCount"*/}
            {/*        value={value}*/}
            {/*        onChange={(e, val) => onChange(val as number)}*/}
            {/*        step={1}*/}
            {/*        min={1}*/}
            {/*        max={7}*/}
            {/*        marks*/}
            {/*    />*/}
            {/*</Box>*/}
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
                        max={7}
                        step={1}
                        marks={marks}
                        sx={{ height: '260' }}
                    />
                </Box>
                <p className={styles.difficulty__value}>{marks[value - 1].description}</p>
            </div>
            <div className={styles.actions} style={{marginTop: '0px'}}>
                <button className={'submit'} onClick={onBack}>{training.back}</button>
                <button className={'submit'} onClick={onNext}>{training.next}</button>
            </div>
        </div>
    );
};