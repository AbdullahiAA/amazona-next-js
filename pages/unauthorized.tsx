import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components";

export default function Unauthorized() {
  const { query } = useRouter();
  const { message } = query;
  return (
    <Layout title="Unauthorized Page">
      <h1 className="mb-4 text-xl">Access Denied</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}
