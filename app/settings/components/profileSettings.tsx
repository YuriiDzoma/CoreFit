'use client';
import React from "react";
import styles from './settings.module.scss';
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import {useForm} from "react-hook-form";
import {emailOptions, firstNameOptions, lastNameOptions} from "../../../lib/validations";
import InputBox from "../../components/inputBox/inputBox";

type profileSettingsForm = {
    name: string;
    email: string;
};

const ProfileSettings = () => {
    const {settings, base} = useAppSelector(getText);

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<profileSettingsForm>();

    const onSubmit = async (data: profileSettingsForm) => {
        try {
            console.log(data);
            // const response = await login(data.email, data.password);
            // if (response?.success) {
            //     dispatch(setEmail(data.email));
            //     navigate("/");
            // } else if (response?.errors?.[0]?.code === "authentication_failed") {
            //     setError("All");
            // }
        } finally {
            console.log('success');
        }
    };

    return (
        <div className={styles.profile}>
            <p className={styles.profile__title}>{settings.profile}</p>
            <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
                <InputBox
                    errors={errors}
                    name="name"
                    placeholder={base.plHolName}
                    label={base.lblName}
                    options={register("name", firstNameOptions)}
                />
                <InputBox
                    errors={errors}
                    name="name"
                    placeholder={base.plHolLastName}
                    label={base.lblLastName}
                    options={register("name", lastNameOptions)}
                />
                {/*<InputBox*/}
                {/*    errors={errors}*/}
                {/*    name="email"*/}
                {/*    type="text"*/}
                {/*    placeholder={base.plHolEmail}*/}
                {/*    label={base.lblEmail}*/}
                {/*    options={{*/}
                {/*        ...register("email", {*/}
                {/*            ...emailOptions,*/}
                {/*            onChange: () => clearErrors(),*/}
                {/*        }),*/}
                {/*    }}*/}
                {/*/>*/}
                <button className={`submit`}>{base.save}</button>
            </form>
        </div>
    )
}

export default ProfileSettings;
