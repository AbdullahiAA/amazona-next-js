import Head from "next/head";
import Link from "next/link";
import React from "react";

type ILayout = {
  title?: string;
  children: JSX.Element | string;
};

export default function Layout({ title, children }: ILayout) {
  return (
    <>
      <Head>
        <title>{title ? title + " - Amazona" : "Amazona"}</title>
        <meta
          name="description"
          content="Amazona is the #1 E-commerce store in the world"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <header className="shadow-lg p-4">
          <nav className="flex justify-between items-center">
            <Link href="/">
              <a className="text-lg font-bold">amazona</a>
            </Link>

            <div>
              <Link href="/cart">
                <a className="p-2">Cart</a>
              </Link>

              <Link href="/cart">
                <a className="p-2">Login</a>
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1 container m-auto p-4">{children}</main>

        <footer className="shadow-inner">
          <p className="text-center text-sm p-2">
            &copy; copyright 2022, TechPro Digital Concept
          </p>
        </footer>
      </div>
    </>
  );
}
