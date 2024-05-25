import Layout2 from "@/components/Layouts/Layout2";
import SvgIcons from "@/components/SvgIcons";
import { getCookieName } from "@/lib/utils";
import ProgramService from "@/services/ProgramService";
import { Button, Flex, Space, Spin } from "antd";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Certificate.module.scss";
import { CourseCertificates } from "@prisma/client";
import prisma from "@/lib/prisma";

const ShowCertificate = () => {
  const [certificateData, setCertificateData] = useState<CourseCertificates>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const [courseName, setCourseName] = useState<string>();
  const router = useRouter();
  const getCertificateImgUrl = () => {
    setLoading(true);
    ProgramService.getCertificate(
      Number(router.query.courseId),
      (result) => {
        setCertificateData(result.certificateDetail.getIssuedCertificate);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    ProgramService.getCourses(
      Number(router.query.courseId),
      (result) => {
        setCourseName(result.courseDetails.name);
        getCertificateImgUrl();
      },
      (error) => {}
    );
  }, [router.query.courseId]);

  return (
    <Layout2>
      {loading ? (
        <Spin fullscreen />
      ) : (
        <Space direction="vertical" size={"middle"} className={styles.certificate_page}>
          <div>
            <h2>Hello {session?.user?.name}</h2>

            <Flex style={{ fontSize: 20 }} className={styles.certificate_header}>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <Link href={`/courses/${router.query.courseId}`}> {courseName}</Link>
              <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div> Certificate
            </Flex>
          </div>
          <p className={styles.about_description}>
            Torqbit certifies the successful completion of <span>{courseName}</span> by{" "}
            <span>{session?.user?.name} </span>
          </p>
          <div className={styles.certificate_image}>
            <img
              src={String(certificateData?.imagePath)}
              height={500}
              width={800}
              alt={session?.user?.name ?? "Certificate"}
            />

            <Button
              type="primary"
              onClick={() => {
                router.push(`/courses/${router.query.courseId}/certificate/download/${certificateData?.id}`);
              }}
            >
              <Flex align="center" gap={10}>
                {" "}
                Download Certificate {SvgIcons.arrowRight}
              </Flex>
            </Button>
          </div>
        </Space>
      )}
    </Layout2>
  );
};

export default ShowCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isCompleted = await prisma?.courseRegistration.findFirst({
      where: {
        studentId: user.id,
        courseId: Number(params.courseId),
      },
    });

    if (isCompleted?.courseState !== "COMPLETED") {
      return {
        redirect: {
          permanent: false,
          message: "you are not enrolled in this course",
          destination: "/unauthorized",
        },
      };
    }
  }
  return { props: {} };
};
