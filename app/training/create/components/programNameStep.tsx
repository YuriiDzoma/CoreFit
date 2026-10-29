'use client';

import React, {useState} from 'react';
import styles from './create.module.scss';
import {useForm} from "react-hook-form";
import {nameOptions} from "../../../../lib/validations";
import InputBox from "../../../components/inputBox/inputBox";
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";
import {ProgramVisibility} from "@/types/training";

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
    /** Who can see the program -- omitted for global (Complexes) programs. */
    visibility?: ProgramVisibility;
    onVisibilityChange?: (value: ProgramVisibility) => void;
}

const VISIBILITY_OPTIONS: ProgramVisibility[] = ['public', 'friends', 'trainer', 'private'];

const ProgramNameStep: React.FC<Props> = ({ value, onChange, onNext, onSave, canSave, visibility, onVisibilityChange }) => {
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
            {visibility && onVisibilityChange && (
                <fieldset className={styles.visibility}>
                    <legend className={styles.create__title}>{training.visibilityTitle}</legend>
                    {VISIBILITY_OPTIONS.map((option) => {
                        const key = option[0].toUpperCase() + option.slice(1) as 'Public' | 'Friends' | 'Trainer' | 'Private';
                        return (
                            <label
                                key={option}
                                className={`${styles.visibility__option} ${visibility === option ? styles.visibility__optionActive : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={option}
                                    checked={visibility === option}
                                    onChange={() => onVisibilityChange(option)}
                                />
                                <span className={styles.visibility__text}>
                                    <span className={styles.visibility__label}>{training[`visibility${key}`]}</span>
                                    <span className={styles.visibility__desc}>{training[`visibility${key}Desc`]}</span>
                                </span>
                            </label>
                        );
                    })}
                </fieldset>
            )}
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
