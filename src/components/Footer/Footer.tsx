import Link from "next/link";
import React from "react";
import styles from "@/styles/Footer.module.scss";
const Footer = () => {
  return (
    <div className={styles.section_footer}>
      <div className={styles.footer_top}>
        <div className={styles.footer_top_left}>
          <div className={styles.company_name}>
            <Link href='/courses'>
              <img src='/img/logo.png' alt='torqbit' />
            </Link>
          </div>
          <div className={styles.company_desc}>Software Development Center, that believes in perfection and high quality.</div>
        </div>
      </div>
      <div className={styles.border_top}></div>
      <div className={styles.footer_bottom}>
        <div>Copyright &copy; {new Date().getFullYear()} Torqbit</div>
      </div>
    </div>
  );
};

export default Footer;
