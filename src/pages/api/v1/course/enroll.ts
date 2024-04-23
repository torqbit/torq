import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import getUserById from "@/actions/getUserById";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { createCourseExpiry } from "@/services/helper";

export const validateReqBody = z.object({
  userId: z.number(),
  courseId: z.number(),
  courseType: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { userId, courseId, courseType } = body;

    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    if (course) {
      const addDays = function (days: number) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date;
      };

      const expiryDate = addDays(Number(course.expiryInDays));

      // check is user Active
      const currentUser = await getUserById(userId);
      if (!currentUser || !currentUser.isActive) {
        return res.status(400).json({
          success: false,
          message: "Sorry, You don't have an active user",
        });
      }

      // check user already enrolled
      const alreadyEnrolled = await prisma.courseRegistration.findFirst({
        where: { courseId: courseId, studentId: userId },
      });
      if (alreadyEnrolled) {
        return res.status(201).json({
          success: true,
          message: "You have already enrolled in this course",
        });
      }

      // IF COURSE IS FREE
      if (courseType === "FREE") {
        // set expire duration in course

        await prisma.courseRegistration.create({
          data: {
            studentId: userId,
            courseId: courseId,
            expireIn: expiryDate,
            courseState: "ENROLLED",
          },
        });

        return res.status(200).json({
          success: true,
          message: "Congratulations you have successfully enrolled this course",
        });
      }
      if (courseType === "PAID") {
        return res.status(400).json({
          success: false,

          error: "Paid course not configured",
        });
      }
    }
  } catch (error: any) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));
