'use client';
import styles from './inputBox.module.scss';
import React from "react";
import { FieldErrors, FieldError, UseFormRegisterReturn } from "react-hook-form";
import {useAppSelector} from "../../hooks/redux";
import {getIsDarkTheme} from "../../../store/selectors";

type InputBoxProps = {
    errors: FieldErrors;
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    options?: UseFormRegisterReturn;
    defaultValue?: string;
};

const InputBox: React.FC<InputBoxProps> = ({
                                               errors,
                                               name,
                                               label,
                                               type = "text",
                                               placeholder = "",
                                               options,
                                               defaultValue = '',
                                           }) => {
    const isDark = useAppSelector(getIsDarkTheme);

    return (
        <div className={styles.inputBox}>
            <label className={styles.inputBox__label} htmlFor={name}>{label}</label>
            <input
                className={`${styles.inputBox__input} ${(errors[name] || errors['All']) ? styles.inputBox__error : ''}`}
                type={type}
                placeholder={placeholder}
                id={name}
                name={name}
                {...options}
                defaultValue={defaultValue}
                style={{ color: isDark ? '#fff' : '#19355A' }}
            />
            {errors && typeof errors[name] === 'object' && 'message' in errors[name]! && (
                <p className="errorMsg">{(errors[name] as FieldError).message}</p>
            )}
        </div>
    )
}

export default InputBox;
