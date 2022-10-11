import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

type ILayout = {
  title?: string;
  children: any;
};

export default function Layout({ title, children }: ILayout) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cart?.cartItems?.reduce(
        (a: number, c: { quantity: number }) => a + c.quantity,
        0
      )
    );
  }, [cart.cartItems]);

  function logoutHandler() {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  }

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

      <ToastContainer position="bottom-center" theme="dark" />

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
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {status === "loading" ? (
                <p className="p-2">Loading</p>
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="p-2 text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right border bg-white shadow-lg">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link text-red-600 hover:text-red-800 hover:bg-red-100"
                        href="#"
                        onClick={logoutHandler}
                      >
                        Logout
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
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
