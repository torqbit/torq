import { FC } from "react";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import Image from "next/image";

const HeroImage: FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <section className={styles.hero__img}>
    <Image
      alt="Website builder screenshot"
      height={isMobile ? 218 : 625}
      width={isMobile ? 350 : 1000}
      src="/screenshot/display-markkk.png"
    />
  </section>
);

export default HeroImage;
