import { Alert, Button } from "antd";
import React, { useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
import { cookieName } from "@/middleware";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();

  React.useEffect(() => {
    if (router.query.error) {
      if (router.query.error === "OAuthAccountNotLinked") {
        closeLoading();
        setLoginError("You have already signed in with a different provider.");
      }
      if (router.query.error === "AccessDenied") {
        setLoginError("Sorry, You don't have an early access. Please contact us at train@torqbit.com");
        closeLoading();
      }
    }
    closeLoading();
  }, [router.query]);

  const closeLoading = () => {
    setGitHubLoading(false);
    setGoogleLoading(false);
  };

  if (sessionStatus === "loading") {
    return <SpinLoader />;
  }

  return (
    <div className={styles.login_page_wrapper}>
      <div className={styles.login_img}>
        <img src='/img/login-right-img.svg' alt='' />
      </div>
      <div className={styles.social_login_container}>
        <h3>Welcome to Torqbit</h3>

        <Button
          onClick={() => {
            setGoogleLoading(true);
            signIn("google");
          }}
          icon={<img src='./img/google.svg' width={25} />}
          type='primary'
          loading={googleLoading}
          className={styles.google_btn}>
          Login with Google
        </Button>
        <Button
          onClick={() => {
            setGitHubLoading(true);
            signIn("github");
          }}
          loading={gitHubLoading}
          icon={<img src='./img/github.svg' width={35} />}
          type='primary'
          className={styles.github_btn}>
          Login with GitHub
        </Button>
        {loginError && <Alert message='Login Failed!' description={loginError} type='error' showIcon closable />}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/programs",
      },
    };
  }
  return { props: {} };
};

export default LoginPage;
