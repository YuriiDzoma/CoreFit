import * as React from 'react';
import Box from '@mui/material/Box';
import MuiStepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import styles from './create.module.scss';
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";
import './create.scss';

interface Props {
    activeStep: number;
}

const StepperComponent: React.FC<Props> = ({ activeStep }) => {
    const { training } = useAppSelector(getText);

    const steps = [training.name, training.type, training.difficulty, training.days, training.exercises];

    return (
        <div className={styles.stepper}>
            <Box sx={{ width: '100%' }}>
                <MuiStepper activeStep={activeStep - 1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel><span>{label}</span></StepLabel>
                        </Step>
                    ))}
                </MuiStepper>
            </Box>
        </div>
    );
};

export default StepperComponent;
