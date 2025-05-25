'use client'
import React from "react";
import {useForm} from "react-hook-form";
import InputBox from "../../components/inputBox/inputBox";
import {emailOptions, firstNameOptions, lastNameOptions, passwordOptions} from "../../../lib/validations";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";


type signInForm = {
    name: string;
    email: string;
    password: string;
};

const SignInForm = () => {
    const { base } = useAppSelector(getText)
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<signInForm>();

    const onSubmit = async (data: signInForm) => {
        try {
            console.log(data)
            // const response = await login(data.email, data.password);
            // if (response?.success) {
            //     dispatch(setEmail(data.email));
            //     navigate("/");
            // } else if (response?.errors?.[0]?.code === "authentication_failed") {
            //     setError("All");
            // }
        } finally {
            console.log('success')
        }
    };

    return (
        <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={'title'}>{base.authorization}</h2>
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