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
        <h1>
          Become top 1% <br /> Full stack Developer
        </h1>
        <p>
          Torqbit trains you by building real software products, makes you face real world challenges and guides you to
          success
        </p>
        <Button aria-label="Get Started for free" type="primary">
          Get Started for free
        </Button>
      </div>
    </>
  );
};

export default MarketingHero;
