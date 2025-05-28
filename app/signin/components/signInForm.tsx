'use client'
import React from "react";
import {useForm} from "react-hook-form";
import InputBox from "../../components/inputBox/inputBox";
import {emailOptions, firstNameOptions, lastNameOptions, passwordOptions} from "../../../lib/validations";
import Link from "next/link";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import { registerUserWithEmail } from '@/lib/userData';

import { useRouter } from "next/navigation";


type signInForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};


const SignInForm = () => {
    const { base } = useAppSelector(getText)
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<signInForm>();

    const router = useRouter();

    const onSubmit = async (data: signInForm) => {
        const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

        const { error } = await registerUserWithEmail(fullName, data.email, data.password);

        if (error) {
            setError("email", { message: error });
            return;
        }

        router.push('/');
    };

    return (
        <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={'title'}>{base.authorization}</h2>
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
            <InputBox
                errors={errors}
                name="email"
                type="text"
                placeholder={base.plHolEmail}
                label={base.lblEmail}
                options={{
                    ...register("email", {
                        ...emailOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />
            <InputBox
                errors={errors}
                name="password"
                type="password"
                placeholder={base.plHolPass}
                label={base.lblPass}
                options={{
                    ...register("password", {
                        ...passwordOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />
            <button type={"submit"} className={`submit`}>
                <span>{base.signUp}</span>
            </button>
            <div className={'toSign'}>
                <p>{base.haveAcc}</p>
                <Link href={'/login'}>{base.login}</Link>
            </div>
        </form>
    )
}

export default SignInForm;