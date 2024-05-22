import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();

  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });
  const userId = token?.id;
  const { courseId } = req.query;
  try {
    const alreadyRegisterd = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        courseId: Number(courseId),
      },

      select: {
        courseId: true,
        courseType: true,
      },
    });
    let isEnrolled = false;
    const chapterDetail = await prisma.chapter.findMany({
      where: {
        courseId: Number(courseId),
      },
      select: {
        resource: {
          select: {
            resourceId: true,
          },
        },
      },
    });
    if (alreadyRegisterd) {
      const latestLesson = await prisma.courseProgress.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          courseId: alreadyRegisterd.courseId,
        },
      });
      if (latestLesson) {
        const enrollStatus = {
          isEnrolled: true,
          lessonId: latestLesson?.resourceId,
        };
        return res.status(200).json({ success: true, enrollStatus });
      } else if (!latestLesson) {
        const enrollStatus = {
          isEnrolled: true,
          lessonId: chapterDetail[0].resource[0].resourceId,
        };
        return res.status(200).json({ success: true, enrollStatus });
      }
    }
    return res.status(200).json({
      success: true,
      enrollStatus: { isEnrolled: false, lessonId: chapterDetail[0].resource[0].resourceId },
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
