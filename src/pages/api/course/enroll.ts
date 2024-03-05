import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import getUserById from "@/actions/getUserById";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { createCourseExpiry } from "@/services/helper";
import { getProgramDetailById } from "@/actions/getCourseById";

export const validateReqBody = z.object({
  userId: z.number(),
  programId: z.number(),
  programType: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { userId, programId, programType } = body;

    // check is user Active
    const currentUser = await getUserById(userId);
    if (!currentUser || !currentUser.isActive) {
      return res.status(400).json({
        success: false,
        message: "Sorry, You don't have an active user",
      });
    }

    // check user already enrolled
    const alreadyEnrolled = await prisma.programRegistration.findFirst({
      where: { programId: programId, studentId: userId },
    });
    if (alreadyEnrolled) {
      return res.status(201).json({
        success: true,
        message: "You have already enrolled in this course",
        already: true,
      });
    }

    // IF COURSE IS FREE
    if (programType === "FREE") {
      // set expire duration in course
      let expireIn;
      if (currentUser.role === "STUDENT") {
        expireIn = createCourseExpiry(1); // after 1 year
      }
      await prisma.programRegistration.create({
        data: {
          studentId: userId,
          programId: programId,
          expireIn: expireIn && new Date(expireIn as string),
          programState: "ENROLLED",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Congratulations you have successfully enrolled this course",
        already: false,
      });
    }

    return res.status(200).json({
      success: true,
      already: false,
    });
  } catch (error: any) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));
