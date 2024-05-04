import Layout2 from "@/components/Layout2/Layout2";
import SvgIcons from "@/components/SvgIcons";
import { Button, Flex, Space } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";

const UnAuthorized: NextPage = () => {
  const router = useRouter();
  return (
    <Layout2>
      <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Space direction="vertical">
          <Flex justify="center" gap={10}>
            <div>{SvgIcons.lock}</div> <h1>You are not authorized to this page</h1>
          </Flex>
          <Flex align="center" justify="center" gap={20}>
            {router.query.from === "lesson" && (
              <Button type="primary" onClick={() => router.push("/courses")}>
                <Flex justify="space-between" gap={10}>
                  Browse Courses {SvgIcons.arrowRight}
                </Flex>{" "}
              </Button>
            )}
            <Button onClick={() => router.push("/dashboard")}>Go Home</Button>
          </Flex>
        </Space>
      </section>
    </Layout2>
  );
};

export default UnAuthorized;
