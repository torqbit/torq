import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { certificateId } = req.query;

    const getIssuedCertificate = await prisma.courseCertificates.findUnique({
      where: {
        id: String(certificateId),
      },
      select: {
        imagePath: true,
        pdfPath: true,
        RegisteredCourse: {
          select: {
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course",
      certificateDetail: {
        imgPath: getIssuedCertificate?.imagePath,
        pdfPath: getIssuedCertificate?.pdfPath,
        courseName: getIssuedCertificate?.RegisteredCourse.course.name,
      },
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
