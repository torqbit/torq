import React, { useEffect } from "react";
import styles from "@/styles/Dashboard.module.scss";
import Layout2 from "@/components/Layout2/Layout2";
import { useSession } from "next-auth/react";
import { Space, Tag } from "antd";
import { ISiderMenu, useAppContext } from "@/components/ContextApi/AppContext";


const QuizzesPage = () => {
    const { data: user } = useSession();
    const { globalState, dispatch } = useAppContext();

    useEffect(() => {
        dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: "quiz" as ISiderMenu })
    }, [])

    return (
        <Layout2>
            <section className={styles.dashboard_content}>
                <div className={styles.guide_wrapper}>
                    <h2>Hello {user?.user?.name}</h2>
                    <Space style={{ marginTop: 30, marginBottom: 10 }}>
                        <h3 style={{ margin: 0 }}>Quizzes</h3>
                        <Tag>Coming Soon</Tag>
                    </Space>

                    <p className={styles.guide_wrapper}>Attempt the interactive quizzes to check your skills level.</p>
                    <img height={400} src="/img/quiz/quiz-illustration.svg" alt="" style={{ display: "block" }} />

                </div>
            </section>
        </Layout2>

    );
};

export default QuizzesPage;