'use client'
import React from "react";
import {useForm} from "react-hook-form";
import InputBox from "../../components/inputBox/inputBox";
import {emailOptions, passwordOptions} from "../../../lib/validations";
import Link from "next/link";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import {useDispatch} from "react-redux";
import GoogleLogin from "./googleLogin";
import styles from './login.module.scss'
import {useRouter} from "next/navigation";
import {login} from "../../../lib/userData";

const Login = () => {
    const { base } = useAppSelector(getText)
    const router = useRouter();
    type LoginForm = {
        email: string;
        password: string;
    };

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await login(data.email, data.password);

            if (response?.success) {
                router.push('/');
            } else {
                setError("email", { message: response?.error || "Login failed" });
            }
        } catch (e) {
            setError("email", { message: "Unexpected error" });
        }
    };


    return (
        <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={'title'}>{base.authorization}</h2>
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
            <div className={styles.actions}>
                <button type={"submit"} className={`submit`}>
                    <span>{base.login}</span>
                </button>
                <GoogleLogin />
            </div>

            <div className={'toSign'}>
                <p>{base.notHaveAcc}</p>
                <Link href={'/signin'}>{base.signUp}</Link>
            </div>

        </form>
    )
}

export default Login;