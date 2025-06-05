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
}

const ProgramNameStep: React.FC<Props> = ({ value, onChange, onNext }) => {
    const { training } = useAppSelector(getText);

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
        </form>
    );
};

export default ProgramNameStep;
