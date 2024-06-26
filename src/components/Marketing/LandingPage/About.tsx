import appConstant from "@/services/appConstant";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { Button, Card } from "antd";
import styles from "@/styles/NavBar.module.scss";

const About = () => {
  const cardDetail = [
    {
      icon: MarketingSvgIcons.openSource,
      title: "Open source platform",
      description:
        "The training platform has been open sourced, and we train people to become open source contributors to build network and learn from the best",
    },
    {
      icon: MarketingSvgIcons.illustrativeVideo,
      title: "illustrative videos",
      description:
        "We have crafted easy to understand illustrations for explaining complex concepts, thereby allowing students to move faster and start building products.",
    },
    {
      icon: MarketingSvgIcons.codeIcon,
      title: "High quality coding",
      description:
        "We emphasize on writing quality code, as the code is read and debugged multiple times. And such coders are highly demanded.",
    },
  ];
  return (
    <section className={styles.aboutContainer}>
      <h1>What&apos;s different about {appConstant.platformName}?</h1>
      <div className={styles.cardWrapper}>
        {cardDetail.map((detail, i) => {
          return (
            <div key={i} className={styles.card}>
              <div className={styles.icon}>{detail.icon}</div>
              <div className={styles.content}>
                <h2>{detail.title}</h2>
                <p>{detail.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.paceYourLearning}>
        <div>{MarketingSvgIcons.rocket}</div>
        <div>
          <h2>Rocket pace your learning with {appConstant.platformName}</h2>
          <p>
            we&apos;re currently offering our courses for free during our initial launch, to get feedback and stabilize
            the learning platform
          </p>
          <div className={styles.buttonWrapper}>
            <Button aria-label="Get started for free" type="primary">
              Get started for free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
