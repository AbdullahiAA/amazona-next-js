import Link from "next/link";
import React, { useEffect } from "react";
import { Layout } from "../components";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

type LoginDetails = {
  email: string;
  password: string;
};

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: { redirect?: URL } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDetails>();
  const onSubmit: SubmitHandler<LoginDetails> = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
    } catch (err) {
      toast.error(getError(err) || "An error occured!");
    }
  };

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
