import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import getUserById from "@/actions/getUserById";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const validateReqBody = z.object({
  courseId: z.number(),
  courseType: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { courseId, courseType } = body;

    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
    });
    if (!token || !token.isActive) {
      return res.status(400).json({
        success: false,
        message: "Sorry, You don't have an active user",
      });
    }

    if (course) {
      const addDays = function (days: number) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date;
      };

      const expiryDate = addDays(Number(course.expiryInDays));

      // check is user Active

      // check user already enrolled
      const alreadyEnrolled = await prisma.courseRegistration.findFirst({
        where: { courseId: courseId, studentId: token.id },
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
            studentId: token.id,
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
