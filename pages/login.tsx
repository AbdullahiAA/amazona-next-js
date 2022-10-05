import Link from "next/link";
import React from "react";
import { Layout } from "../components";

export default function Login() {
  return (
    <Layout title="Login">
      <form className="max-auto max-w-screen-md flex flex-col gap-4">
        <h1 className="text-xl">Login</h1>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="w-full" autoFocus />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="w-full" />
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
