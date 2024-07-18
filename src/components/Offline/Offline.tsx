import { Flex } from "antd";
import styles from "@/styles/Layout2.module.scss";
import SvgIcons from "../SvgIcons";

const Offline = () => {
  return (
    <Flex align="center" justify="center" className={styles.offline_page_wrapper}>
      <Flex vertical align="center" justify="center">
        <img src="/icon/torqbit.png" alt="" />
        <div className={styles.content}>
          <i>{SvgIcons.noNetwork}</i>
          <div>
            <h1>You are currently offline!</h1>
            <h4>Please check your internet connection</h4>
          </div>
        </div>
      </Flex>
    </Flex>
  );
};

export default Offline;
