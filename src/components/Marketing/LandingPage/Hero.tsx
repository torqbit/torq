import { FC } from "react";

import styles from "@/styles/MarketingHero.module.scss";
import { Button } from "antd";
import SvgIcons from "@/components/SvgIcons";
import SvgComponent from "./HeroWave";

const MarketingHero: FC<{}> = () => {
  return (
    <>
      <div className={styles.heroWaveIcon}>
        <SvgComponent className={styles.heroWave} />
      </div>
      <div className={styles.dotPatternIcon}>{SvgIcons.dotPattern}</div>

      <div className={styles.heroContentContainer}>
        <h1
          data-aos="fade-up"
          data-aos-offset="100"
          data-aos-delay="50"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
        >
          Become top 1% <br /> Full stack Developer
        </h1>
        <p
          data-aos="fade-up"
          data-aos-offset="100"
          data-aos-delay="150"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
        >
          Torqbit trains you by building real software products, makes you face real world challenges and guides you to
          success
        </p>
        <div
          data-aos="fade-up"
          data-aos-offset="100"
          data-aos-delay="150"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
        >
          <Button aria-label="Get Started for free" type="primary">
            Get Started for free
          </Button>
        </div>
      </div>
    </>
  );
};

export default MarketingHero;
