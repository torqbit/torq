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
        "The training has been open sourced, and we train people to becaome open source contributors to build network and learn from the best",
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
        "We emphasizes on writing quality code, as the code is read and debugged multiple times. And such coders are highly demanded.",
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
                <h4>{detail.title}</h4>
                <p>{detail.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.paceYourLearning}>
        <div>{MarketingSvgIcons.rocket}</div>
        <div>
          <h4>Rocket pace your learning with {appConstant.platformName}</h4>
          <p>
            we&apos;re currently offering our courses for free during our initial launch, to get feedback and stabilize
            the learning platform
          </p>
          <div className={styles.buttonWrapper}>
            <Button type="primary">Get started for free</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
