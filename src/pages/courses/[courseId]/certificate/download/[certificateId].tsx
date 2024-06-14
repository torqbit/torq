import { getCookieName } from "@/lib/utils";
import ProgramService from "@/services/ProgramService";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";

const DownloadCertificate = () => {
  const [certificatePdfPath, setCertificatePdfPath] = useState<string>();

  const router = useRouter();
  useEffect(() => {
    ProgramService.getCertificate(
      Number(router.query.courseId),
      (result) => {
        setCertificatePdfPath(String(result.certificateDetail.getIssuedCertificate.pdfPath));
      },
      (error) => {}
    );
  }, [router.query.courseId]);

  return (
    <section style={{ height: "100vh" }}>
      <object data={certificatePdfPath} type="application/pdf" width="100%" height="100%"></object>
    </section>
  );
};

export default DownloadCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isCompleted = await prisma?.courseRegistration.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: Number(params.courseId),
        },
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
