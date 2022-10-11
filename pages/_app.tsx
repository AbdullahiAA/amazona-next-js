import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { StoreProvider } from "../utils/Store";
import { useRouter } from "next/router";
import { Layout } from "../components";

type IAuth = {
  children: any;
};

type IMyApp = AppProps & {
  Component: { auth?: boolean };
  pageProps: { session?: any };
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: IMyApp) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }: IAuth) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("unauthorized?message=Login required");
    },
  });

  if (status === "loading") {
    return <Layout>Loading...</Layout>;
  }

  return children;
}

export default MyApp;
