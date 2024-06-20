import { FC, useState } from "react";
import NavBar from "./NavBar";
import styles from "@/styles/MarketingHero.module.scss";
import { Button } from "antd";
import SvgIcons from "@/components/SvgIcons";
import SvgComponent from "./HeroWave";
import Hamburger from "hamburger-react";
import SideNav from "./animate";

const MarketingHero: FC<{}> = () => {
  const [showSideNav, setSideNav] = useState(false);

  const onAnchorClick = () => {
    setSideNav(false);
  };
  return (
    <section className={styles.heroWrapper}>
      <NavBar />
      <SideNav isOpen={showSideNav} onAnchorClick={onAnchorClick} />

      <div className={styles.hamburger}>
        <Hamburger
          rounded
          direction="left"
          toggled={showSideNav}
          onToggle={(toggle: boolean | ((prevState: boolean) => boolean)) => {
            setSideNav(toggle);
          }}
        />
      </div>
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
        <Button type="primary">Get Started for free</Button>
      </div>
    </section>
  );
};

export default MarketingHero;
