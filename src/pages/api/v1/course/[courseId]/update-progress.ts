import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const validateReqBody = z.object({
  resourceId: z.number(),
  courseId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const userId = token?.id;
    const body = await req.body;
    const { resourceId, courseId } = body;
    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        courseId: Number(courseId),
      },
      select: {
        courseId: true,
      },
    });
    if (isEnrolled?.courseId) {
      try {
        userId &&
          (await prisma.courseProgress.create({
            data: {
              courseId: Number(courseId),
              resourceId: resourceId,
              studentId: userId,
            },
          }));
      } catch (error: any) {
        //ignore this error
        console.log(error);
      }

      const courseProgress = await prisma.$queryRaw<
        any[]
      >`select COUNT(re.resourceId) as lessons, COUNT(cp.resourceId) as watched_lessons FROM Course as co
      INNER JOIN Chapter as ch ON co.courseId = ch.courseId 
      INNER JOIN CourseRegistration as cr ON co.courseId = cr.courseId
      INNER JOIN Resource as re ON ch.chapterId = re.chapterId
      LEFT OUTER JOIN CourseProgress as cp ON re.resourceId = cp.resourceId AND cr.studentId = cp.user_id
      WHERE co.courseId = ${Number(courseId)} AND re.state = 'ACTIVE' AND cr.studentId = ${userId}`;

      if (courseProgress.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Course progress updated successfully",
          progress: {
            lessonsCompleted: Number(courseProgress[0].watched_lessons),
            totalLessons: Number(courseProgress[0].lessons),
          },
        });
      } else {
        res.status(400).json({ success: false, error: "You are not enrolled in this course" });
      }
    } else {
      res.status(400).json({ success: false, error: "You are not enrolled in this course" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
