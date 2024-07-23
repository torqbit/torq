import { FC } from "react";

import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { Space } from "antd";
import Link from "next/link";
import { User } from "@prisma/client";

const MarketingHero: FC<{ isMobile: boolean; user: User }> = ({ isMobile, user }) => {
  return (
    <>
      <div className={styles.heroContentContainer}>
        <div className={styles.preview__tag}>Currently available for preview</div>
        <h1>
          Become <del>fullstack</del>
          <br /> Product Developer
        </h1>
        <p>
          Transform into an independent freelancer or tech entrepreneur or the most demanded software developer by
          building a website builder
        </p>

        <Space size={"large"} style={{ marginBottom: 50 }}>
          <Link href={`/login`} className={styles.btn__signup}>
            {user ? "Go to Dashboard" : " Sign up for free"}
          </Link>
          <a className={styles.btn__contact} href="mailto:support@torqbit.com" aria-label="Contact us through mail">
            Contact Us
          </a>
        </Space>
      </div>
    </>
  );
};

export default MarketingHero;
