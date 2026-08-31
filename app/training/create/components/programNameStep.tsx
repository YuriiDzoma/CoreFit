'use client';

import React, {useState} from 'react';
import styles from './create.module.scss';
import {useForm} from "react-hook-form";
import {nameOptions} from "../../../../lib/validations";
import InputBox from "../../../components/inputBox/inputBox";
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";

type formTypes = {
    name: string;
};

interface Props {
    value: string;
    onChange: (val: string) => void;
    onNext: () => void;
    /** Present only in edit mode -- jumps straight to save+close instead of
     * advancing, so a one-field edit doesn't require walking every step.
     * Takes the just-submitted name directly (not read back from `value`):
     * `onChange`'s state update isn't visible in the parent's own save
     * logic until the next render, so the fresh value has to ride along
     * explicitly. */
    onSave?: (titleOverride?: string) => void;
    canSave?: boolean;
}

const ProgramNameStep: React.FC<Props> = ({ value, onChange, onNext, onSave, canSave }) => {
    const { training, base } = useAppSelector(getText);

    const {
        register, handleSubmit, formState: {errors}, setError
    } = useForm({
        defaultValues: {
            name: value || '',
        }
    });

    const onSubmit = async (data: formTypes) => {
        if (data.name.length < 3) {
            setError("name", { message: training.errorName })
        } else {
            onChange(data.name)
            onNext();
        }
    };

    const handleSaveClick = handleSubmit((data) => {
        if (data.name.length < 3) {
            setError("name", { message: training.errorName });
            return;
        }
        onChange(data.name);
        onSave?.(data.name);
    });

    return (
        <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.create__title}>{training.programName}</h3>
            <InputBox
                errors={errors}
                name="name"
                placeholder={training.plHolProgramName}
                label={''}
                options={register("name", nameOptions)}
            />
            <button type='submit' className={'submit'}>
                <span>{training.next}</span>
            </button>
            {onSave && (
                <button
                    type="button"
                    className={'submit'}
                    onClick={handleSaveClick}
                    disabled={!canSave}
                >
                    <span>{base.save}</span>
                </button>
            )}
        </form>
    );
};

export default ProgramNameStep;
