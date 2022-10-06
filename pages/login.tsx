import Link from "next/link";
import React from "react";
import { Layout } from "../components";
import { useForm, SubmitHandler } from "react-hook-form";

type LoginDetails = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDetails>();
  const onSubmit: SubmitHandler<LoginDetails> = (data) => console.log(data);

  return (
    <Layout title="Login">
      <form
        className="m-auto max-w-screen-md flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-xl">Login</h1>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter a valid email",
              },
            })}
            autoFocus
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full"
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password should be more than 5 characters",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        <div>
          <button className="primary-button">Login</button>
        </div>

        <div>
          Don&apos;t have an account?&nbsp;
          <Link href="/register">Register</Link>
        </div>
      </form>
    </Layout>
  );
}
