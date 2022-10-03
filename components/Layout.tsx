import Head from "next/head";
import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "../utils/Store";

type ILayout = {
  title?: string;
  children: any;
};

export default function Layout({ title, children }: ILayout) {
  const { cart, state, dispatch } = useContext(Store);
  // const { cart } = state;

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
        <header className="shadow-lg p-4 sticky top-0 z-50 bg-white">
          <nav className="flex justify-between items-center">
            <Link href="/">
              <a className="text-lg font-bold">amazona</a>
            </Link>

            <div className="flex">
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </a>
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
