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
        courseState: true,
      },
    });

    if (alreadyRegisterd) {
      const latestLesson = await prisma.courseProgress.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          courseId: alreadyRegisterd.courseId,
          studentId: token?.id,
        },
        select: {
          resourceId: true,
        },
      });
      if (latestLesson) {
        const enrollStatus = {
          isEnrolled: true,
          nextLessonId: latestLesson?.resourceId,
          courseStarted: true,
          courseCompleted: alreadyRegisterd.courseState === "COMPLETED" ? true : false,
        };
        return res.status(200).json({ success: true, enrollStatus });
      } else if (!latestLesson) {
        const firstResource = await prisma.chapter.findFirst({
          where: {
            courseId: Number(courseId),
            sequenceId: 1,
          },
          select: {
            resource: {
              where: {
                sequenceId: 1,
              },
              select: {
                resourceId: true,
              },
            },
          },
        });
        const enrollStatus = {
          isEnrolled: true,
          nextLessonId: firstResource?.resource[0].resourceId,
          courseStarted: false,
          courseCompleted: false,
        };
        return res.status(200).json({ success: true, enrollStatus });
      }
    }

    return res.status(200).json({
      success: true,
      enrollStatus: { isEnrolled: false, nextLessonId: 0, courseStarted: false, courseCompleted: false },
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
