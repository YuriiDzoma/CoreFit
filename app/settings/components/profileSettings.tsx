'use client';
import React, {useEffect, useState} from "react";
import styles from './settings.module.scss';
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import {useForm} from "react-hook-form";
import {firstNameOptions, lastNameOptions} from "../../../lib/validations";
import InputBox from "../../components/inputBox/inputBox";
import {fetchOwnProfile, updateUserProfile} from "../../../lib/userData";
import {ProfileSettingsSkeleton} from "../../../ui/skeleton/skeleton";

type profileSettingsForm = {
    firstName: string;
    lastName: string;
};

const ProfileSettings = () => {
    const { settings, base } = useAppSelector(getText);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<profileSettingsForm>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await fetchOwnProfile();
            if (profile) {
                const [firstName, lastName] = profile.username?.split(' ') ?? ['', ''];
                reset({
                    firstName,
                    lastName,
                });
            }
            setLoading(false);
        };
        loadProfile();
    }, [reset]);

    const onSubmit = async (data: profileSettingsForm) => {
        const profile = await fetchOwnProfile();
        if (!profile) return;

        const fullName = `${data.firstName} ${data.lastName}`.trim();

        await updateUserProfile(profile.id, {
            username: fullName,
        });
    };

    if (loading) return <ProfileSettingsSkeleton />;

    return (
        <div className={styles.profile}>
            <p className={styles.profile__title}>{settings.profile}</p>
            <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
                <InputBox
                    errors={errors}
                    name="firstName"
                    placeholder={base.plHolName}
                    label={base.lblName}
                    options={register("firstName", firstNameOptions)}
                />
                <InputBox
                    errors={errors}
                    name="lastName"
                    placeholder={base.plHolLastName}
                    label={base.lblLastName}
                    options={register("lastName", lastNameOptions)}
                />
                <button className={`submit`} type="submit">
                    {base.save}
                </button>
            </form>
        </div>
    );
};

export default ProfileSettings;
