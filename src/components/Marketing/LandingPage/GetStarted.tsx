import { FC } from "react";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { Space } from "antd";
import Link from "next/link";


const GetStarted: FC<{}> = () => {

    return <section className={styles.get__started}>
        <div>
            <h3>Get Started with Torqbit today</h3>
            <p>No matter you are a complete beginner  or a seasoned professional, this training platform is for anyone who wants to build and ship great software products.</p>
            <Space size={'large'} style={{ marginBottom: 50 }}>
                <Link href={`/login`} className={styles.btn__signup}>
                    Sign up for free
                </Link>
                <a className={styles.btn__contact} href="mailto:support@torqbit.com" aria-label="Contact us through mail" >Contact Us</a>
            </Space>
        </div>
    </section>
}

export default GetStarted;