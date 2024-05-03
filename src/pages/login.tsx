import { Alert, Button } from "antd";
import React, { useState } from "react";
import styles from "@/styles/Login.module.scss";
import { signIn, useSession } from "next-auth/react";
import { NextPage, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [gitHubLoading, setGitHubLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = React.useState("");
  const { data: session, status: sessionStatus } = useSession();

  React.useEffect(() => {
    if (session != null) {
      console.log(session);
    } else {
      console.log("no session present");
    }
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
        <img src="/img/login-screen.png" alt="Login image" />
        <h3>Learn to Lead</h3>
        <p>Transform into the most competitive individual who drives changes for the betterment.</p>
      </div>
      <div className={styles.social_login_container}>
        <img src="/icon/torq.svg" alt="" />
        <h3>Login to Torq</h3>

        <Button
          onClick={() => {
            setGoogleLoading(true);
            signIn("google");
          }}
          icon={<img src="./img/google.svg" width={25} />}
          type="default"
          loading={googleLoading}
          className={styles.google_btn}
        >
          Login with Google
        </Button>
        <Button
          onClick={() => {
            setGitHubLoading(true);
            signIn("github");
          }}
          loading={gitHubLoading}
          icon={<img src="./icon/github.png" width={35} />}
          type="primary"
          className={styles.github_btn}
        >
          Login with GitHub
        </Button>
        {loginError && <Alert message="Login Failed!" description={loginError} type="error" showIcon closable />}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  console.log("environment..", process.env.NODE_ENV);
  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  console.log(user, "user from server side props");
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: {} };
};

export default LoginPage;
