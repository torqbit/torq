import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const getIssuedCertificate = await prisma.courseCertificates.findUnique({
      where: {
        courseId_studentId: {
          courseId: Number(courseId),
          studentId: String(token?.id),
        },
      },
      select: {
        id: true,
      },
    });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course",
      certificateId: getIssuedCertificate?.id,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
