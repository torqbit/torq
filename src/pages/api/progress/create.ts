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
  sequenceId: z.number(),
  courseId: z.number(),
  chapterId: z.number(),
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
    const { resourceId, chapterId, sequenceId, courseId } = body;
    const isEnrolled = await prisma.courseRegistration.findUnique({
      where: {
        studentId_courseId: {
          studentId: String(userId),
          courseId: Number(courseId),
        },
      },
      select: {
        courseId: true,
      },
    });
    if (isEnrolled?.courseId) {
      const newProgress =
        userId &&
        (await prisma.courseProgress.create({
          data: {
            courseId: Number(courseId),
            resourceId: resourceId,
            studentId: userId,
          },
        }));

      return res.status(200).json({ success: true, message: "Resource updated successfully" });
    } else {
      res.status(400).json({ success: false, error: "You are not enrolled in this course" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));
