import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { ContentManagementService } from "@/services/cms/ContentManagementService";

import { createCertificate } from "@/lib/addCertificate";
import { ICertificateInfo } from "@/types/courses/Course";
import { CourseType, ResourceContentType } from "@prisma/client";
import getTotalScore from "@/actions/getTotalScore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cms = new ContentManagementService();

    let cookieName = getCookieName();

    const { courseId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
        courseType: CourseType.PAID,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        chapters: {
          where: {
            courseId: Number(courseId),
          },
          include: {
            resource: {
              where: {
                state: "ACTIVE",
              },
              include: {
                video: {},
              },
            },
          },
        },
      },
    });

    let totalAssignment = 0;

    course?.chapters.map((ch) => {
      ch.resource
        .filter((r) => r.contentType === ResourceContentType.Assignment)
        .forEach((r) => {
          totalAssignment = totalAssignment + 1;
        });
    });

    const totalScore = await getTotalScore(Number(courseId), String(token?.id));
    if (course) {
      let certificateInfo: ICertificateInfo = {
        studentEmail: String(token?.email),
        studentId: String(token?.id),
        studentName: String(token?.name),
        courseName: course?.name,
        courseId: course?.courseId,
        certificateTemplate: String(course?.certificateTemplate),
        authorName: String(course.user.name),
      };
      await createCertificate(certificateInfo).then((r) => {
        if (r.success) {
          return res.status(200).json(r);
        } else {
          return res.status(400).json(r);
        }
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
