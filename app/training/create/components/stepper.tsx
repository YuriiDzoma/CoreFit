import * as React from 'react';
import Box from '@mui/material/Box';
import MuiStepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import styles from './create.module.scss';
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";
import './create.scss';

interface Props {
    activeStep: number;
    onStepChange: (step: number) => void;
}

const StepperComponent: React.FC<Props> = ({ activeStep, onStepChange }) => {
    const { training } = useAppSelector(getText);

    const steps = [training.name, training.type, training.difficulty, training.days, training.exercises];

    return (
        <div className={styles.stepper}>
            <Box sx={{ width: '100%' }}>
                {/* `nonLinear` -- without it, MUI disables every `StepButton`
                    past the furthest-reached step, silently no-opping a click
                    on any step ahead of where you are. */}
                <MuiStepper activeStep={activeStep - 1} alternativeLabel nonLinear>
                    {steps.map((label, index) => (
                        // `completed`, explicit -- `nonLinear` above turns off MUI's
                        // own automatic "every earlier index is completed" inference
                        // (it can't assume that once steps are freely jumpable), so
                        // without this every checkmark on an already-passed step
                        // disappears. Same rule MUI used to apply automatically:
                        // any step before the current one.
                        <Step key={label} completed={index + 1 < activeStep}>
                            {/* `StepButton`, not `StepLabel` -- jumps straight to the
                                tapped step, no validation gating (matches mobile's own
                                `onStepPress`, and every step already renders safely
                                from its own initial state regardless of what earlier
                                steps hold). */}
                            <StepButton onClick={() => onStepChange(index + 1)}>
                                <span>{label}</span>
                            </StepButton>
                        </Step>
                    ))}
                </MuiStepper>
            </Box>
        </div>
    );
};

export default StepperComponent;
