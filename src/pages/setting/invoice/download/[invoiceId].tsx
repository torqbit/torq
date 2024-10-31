import { getCookieName } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import {} from "next/router";
import { FC } from "react";
import prisma from "@/lib/prisma";

const DownloadInvoice: FC<{ pdfPath: string }> = ({ pdfPath }) => {
  return (
    <section style={{ height: "100vh" }}>
      <object data={pdfPath} type="application/pdf" width="100%" height="100%"></object>
    </section>
  );
};

export default DownloadInvoice;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isInvoice = await prisma?.invoice.findUnique({
      where: {
        id: Number(params.invoiceId),
      },
      select: {
        pdfPath: true,
      },
    });

    if (!isInvoice) {
      return {
        redirect: {
          permanent: false,
          message: "No invoice found",
          destination: "/unauthorized",
        },
      };
    } else {
      return {
        props: {
          pdfPath: isInvoice.pdfPath,
        },
      };
    }
  }
  return { props: {} };
};
